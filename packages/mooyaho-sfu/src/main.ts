import { ServerCredentials, Server } from '@grpc/grpc-js'
import proto, { MooyahoHandlers } from 'mooyaho-grpc'
import ChannelManager from './channel/ChannelManager'
import ConnectionManager from './channel/ConnectionManager'

const server = new Server()

const channels = new ChannelManager()
const connections = new ConnectionManager()

const mooyahoServer: MooyahoHandlers = {
  async Call(call, callback) {
    /*
      1. create or get channel
      2. create new connection via connection manager
      3. push connection to the channel
    */
    const { channelId, sdp, sessionId } = call.request
    const channel = channels.getChannelById(call.request.channelId)
    const connection = connections.getConnectionById(sessionId)
    channel.addConnection(connection)
    const answer = await connection.receiveCall(sdp)

    callback(null, {
      sdp: answer.sdp,
    })
  },
  ClientIcecandidate(call, callback) {
    const connection = connections.getConnectionById(call.request.sessionId)
    try {
      const parsedCandidate = JSON.parse(call.request.candidate)
      connection?.addIceCandidate(parsedCandidate)
    } catch (e) {}

    callback(null, {})
  },
  ListenSignal(call) {
    const connection = connections.getConnectionById(call.request.sessionId)
    if (!connection) {
      call.end()
      return
    }

    connection.registerCandidateHandler(candidate => {
      const str = JSON.stringify(candidate)
      call.write({ candidate: str })
    })

    connection.exitCandidate = () => {
      call.end()
    }
  },
}

server.addService(proto.mooyaho.Mooyaho.service, mooyahoServer)
server.bindAsync(
  'localhost:50000',
  ServerCredentials.createInsecure(),
  (err, port) => {
    server.start()
    console.log('Running server...')
  }
)

// import { Server, ServerCredentials } from 'grpc'
// import {
//   IMooyahoServer,
//   MooyahoService,
// } from 'mooyaho-grpc/src/protos/mooyaho_grpc_pb'
// import { Empty, Signal } from 'mooyaho-grpc/src/protos/mooyaho_pb'
// // import { HelloReply, HelloRequest } from './protos/helloworld_pb'
// // import { GreeterService, IGreeterServer } from './protos/helloworld_grpc_pb'

// const server = new Server()
// const mooyahoServer: IMooyahoServer = {
//   call(call, callback) {
//     const signal = new Signal()
//     console.log(call.request.toObject())
//     signal.setSdp('1234')
//     callback(null, signal)
//   },
//   icecandidate(call, callback) {
//     callback(null, new Empty())
//   },
// }
// // const mooyahoServer: IMooyahoServer = {
// //   call(call, callback) {
// //     const reply = new CallReply()
// //     reply.setValue('Hey')
// //     console.log(call.request.getValue())
// //     callback(null, reply)
// //   },
// // }

// server.addService<IMooyahoServer>(MooyahoService, mooyahoServer)
// server.bind('localhost:50000', ServerCredentials.createInsecure())
// server.start()

// console.log('Running server...')
