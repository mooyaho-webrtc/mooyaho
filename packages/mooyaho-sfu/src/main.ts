import { Server, ServerCredentials } from 'grpc'
import {
  IMooyahoServer,
  MooyahoService,
} from 'mooyaho-grpc/src/protos/mooyaho_grpc_pb'
import { Empty, Signal } from 'mooyaho-grpc/src/protos/mooyaho_pb'
// import { HelloReply, HelloRequest } from './protos/helloworld_pb'
// import { GreeterService, IGreeterServer } from './protos/helloworld_grpc_pb'

const server = new Server()
const mooyahoServer: IMooyahoServer = {
  call(call, callback) {
    const signal = new Signal()
    console.log(call.request.toObject())
    signal.setSdp('1234')
    callback(null, signal)
  },
  icecandidate(call, callback) {
    callback(null, new Empty())
  },
}
// const mooyahoServer: IMooyahoServer = {
//   call(call, callback) {
//     const reply = new CallReply()
//     reply.setValue('Hey')
//     console.log(call.request.getValue())
//     callback(null, reply)
//   },
// }

server.addService<IMooyahoServer>(MooyahoService, mooyahoServer)
server.bind('localhost:50000', ServerCredentials.createInsecure())
server.start()

console.log('Running server...')
