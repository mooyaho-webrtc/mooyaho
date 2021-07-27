const fastify = require('fastify')({ logger: true })
// function doSomething() {
//   console.log('hello world')
// }

// setInterval(doSomething, 1000)

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
