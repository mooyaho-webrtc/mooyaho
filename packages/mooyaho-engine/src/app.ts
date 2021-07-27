import 'dotenv/config'
import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import { FastifyPluginAsync } from 'fastify'
import prisma from './lib/prisma'
import { cleanSessions, disconnectAllSessions } from './routes/websocket'
import traps from '@dnlup/fastify-traps'

setInterval(() => {
  console.log('hey')
}, 1000)

// process.on('SIGINT', () => {
//   console.log('Closing...')
// })

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  await prisma.$connect()
  await cleanSessions()

  console.log(process.listeners('SIGINT'))
  process.removeAllListeners('SIGINT')
  process.removeAllListeners('SIGTERM')
  console.log(process.listeners('SIGINT'))

  fastify.register(traps, {
    timeout: 150150,
  })

  fastify.setErrorHandler((error, request, reply) => {
    // if (isMooyahoError(error)) {
    //   reply.status(error.statusCode)
    // }
    reply.send(error)
  })
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts,
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  })
}

export default app
export { app }
