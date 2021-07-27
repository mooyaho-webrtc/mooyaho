'use strict'

// Read the .env file.
import * as dotenv from 'dotenv'
dotenv.config()

// Require the framework
import Fastify, { fastify } from 'fastify'
import { startClosing } from './lib/close'
import { disconnectAllSessions } from './routes/websocket'

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
})

// Register your application as a normal plugin.
app.register(import('./app'))

process.on('SIGINT', async () => {
  startClosing()
  await disconnectAllSessions()
  app.close()
  setTimeout(() => {
    console.log('Server is now closed')
    process.exit(0)
  }, 1000)
})

// delay is the number of milliseconds for the graceful close to finish
// const closeListeners = closeWithGrace(
//   { delay: 500 },
//   async function ({ signal, err, manual }) {
//     if (err) {
//       app.log.error(err)
//     }
//     await app.close()
//   }
// )

// app.addHook('onClose', async (instance, done) => {
//   closeListeners.uninstall()
//   done()
// })

// Start listening.
app.listen(process.env.PORT || 3000, (err: any) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
