import { FastifyPluginAsync } from 'fastify'
import { isReceiveAction } from './lib/actions/receive'
import Session from './lib/Session'

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session(connection.socket)
    // dispatch ? process? resolve

    connection.socket.on('message', message => {
      try {
        const data = JSON.parse(message.toString())
        if (!isReceiveAction(data)) return
        session.handle(data)
      } catch (e) {
        console.error(e)
      }
    })
  })
}

export default websocket
