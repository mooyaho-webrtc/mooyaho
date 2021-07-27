import { FastifyPluginAsync } from 'fastify'
import path from 'path'
import { isReceiveAction } from '../../lib/websocket/actions/receive'
import fs from 'fs'

import Session from '../../lib/websocket/Session'
import prisma from '../../lib/prisma'
import channelHelper from '../../lib/websocket/channelHelper'

const sessions = new Set<Session>()
const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
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
      await session.dispose()
      removeSessionId(session.id)
      sessions.delete(session)
    })
  })
}

const sessionIdsPath = path.resolve(process.cwd(), '.sessionIds')

const sessionIds = new Set()

function syncSessionIds() {
  const sessionIdsArray = [...sessionIds]
  fs.writeFile(sessionIdsPath, sessionIdsArray.join(','), 'utf-8', err => {})
}

function addSessionId(sessionId: string) {
  sessionIds.add(sessionId)
  syncSessionIds()
}

function removeSessionId(sessionId: string) {
  sessionIds.delete(sessionId)
  syncSessionIds()
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
  const sessionIds = fs.readFileSync(sessionIdsPath, 'utf-8').split(',')
  return Promise.all(sessionIds.map(cleanSession))
}

export function disconnectAllSessions() {
  return Promise.all([...sessions].map(s => s.dispose()))
}

export default websocket
