/**
 * This plugin protects API with API key
 */

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const callback: FastifyPluginAsync = async fastify => {
  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.headers.authorization?.split('Bearer ')[1]
    if (token !== process.env.API_KEY) {
      reply.status(401)
      throw new Error('API Key is missing')
    }
  })
}

const protect = fp(callback, {
  name: 'protect',
})

export default protect
