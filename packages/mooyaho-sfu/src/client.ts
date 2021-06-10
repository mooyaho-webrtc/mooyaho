// import grpc from 'grpc'
// import { HelloRequest } from './protos/helloworld_pb'
// import { GreeterClient } from './protos/helloworld_grpc_pb'

// const client = new GreeterClient(
//   'localhost:50000',
//   grpc.credentials.createInsecure()
// )

// function sayHello() {
//   const request = new HelloRequest()
//   request.setName('Minjun')
//   client.sayHello(request, (error, reply) => {
//     console.log(reply.getMessage())
//   })
// }

// function sayHelloAgain() {
//   const request = new HelloRequest()
//   request.setName('Minjun')
//   client.sayHelloAgain(request, (error, reply) => {
//     console.log(reply.getMessage())
//   })
// }

// sayHello()
// setTimeout(() => {
//   sayHelloAgain()
// }, 5)

// client.sayHello({  }, (error, response) => {
//   console.log(response.message)
// })

// client.sayHello(HelloRequest.)
