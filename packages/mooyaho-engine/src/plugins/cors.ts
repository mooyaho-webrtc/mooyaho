import fp from 'fastify-plugin'
import cors from 'fastify-cors'

export default fp(async (fastify, opts) => {
  if (process.env.CORS === 'true') {
    fastify.register(cors, {
      origin: '*',
    })
  }
})
