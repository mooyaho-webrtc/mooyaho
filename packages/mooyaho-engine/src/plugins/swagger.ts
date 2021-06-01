import fp from 'fastify-plugin'
import swagger from 'fastify-swagger'

/**
 * apply websocket to server
 */
export default fp(async (fastify, opts) => {
  fastify.register(swagger, {
    routePrefix: '/documentation',
    exposeRoute: true,
  })
})
