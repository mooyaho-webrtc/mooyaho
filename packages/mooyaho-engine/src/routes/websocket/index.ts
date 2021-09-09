import { FastifyPluginAsync } from 'fastify'
import path from 'path'
import { isReceiveAction } from '../../lib/websocket/actions/receive'
import fs from 'fs'

import Session from '../../lib/websocket/Session'
import prisma from '../../lib/prisma'
import channelHelper from '../../lib/websocket/channelHelper'
import { getClosing } from '../../lib/close'

const sessions = new Set<Session>()
const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    if (getClosing()) {
      connection.socket.close()
      return
    }
    const session = new Session(connection.socket)

    addSessionId(session.id)
    sessions.add(session)
    connection.socket.on('message', message => {
      // console.log(message)

      try {
        const data = JSON.parse(message.toString())
        if (!isReceiveAction(data)) return
        session.handle(data)
      } catch (e) {
        console.error(e)
      }
    })

    connection.socket.on('close', async (code, reason) => {
      sessions.delete(session)
      await session.dispose()
      await removeSessionId(session.id)
    })
  })
}

const sessionIdsPath = path.resolve(process.cwd(), '.sessionIds')

const sessionIds = new Set()

function syncSessionIds() {
  const sessionIdsArray = [...sessionIds]

  return new Promise<void>(resolve =>
    fs.writeFile(sessionIdsPath, sessionIdsArray.join(','), 'utf-8', err => {
      resolve()
    })
  )
}

function addSessionId(sessionId: string) {
  sessionIds.add(sessionId)
  return syncSessionIds()
}

function removeSessionId(sessionId: string) {
  sessionIds.delete(sessionId)
  return syncSessionIds()
}

async function cleanSession(id: string) {
  const s = await prisma.channelSession.findFirst({
    where: {
      sessionId: id,
    },
  })
  if (!s) return
  channelHelper.leave(s.channelId, id)
}

export function cleanSessions() {
  // load sessionIds from file
  try {
    const sessionIds = fs.readFileSync(sessionIdsPath, 'utf-8').split(',')
    return Promise.all(sessionIds.map(cleanSession))
  } catch (e) {
    return Promise.resolve([])
  }
}

export function disconnectAllSessions() {
  return Promise.all([...sessions].map(s => s.dispose()))
}

export default websocket
