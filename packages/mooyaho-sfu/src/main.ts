import { ServerCredentials, Server } from '@grpc/grpc-js'
import proto, { MooyahoHandlers } from 'mooyaho-grpc'
import ChannelManager from './channel/ChannelManager'
import ConnectionManager from './channel/ConnectionManager'
import { registerDispatchSignal } from './getDispatchSignal'

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
    const channel = channels.getChannelById(channelId)
    const connection = connections.getConnectionById(sessionId)
    channel.addConnection(connection)
    const answer = await connection.receiveCall(sdp)

    callback(null, {
      sdp: answer.sdp,
    })
  },
  ClientIcecandidate(call, callback) {
    const { sessionId, candidate, fromSessionId } = call.request
    const connection = connections.getConnectionById(fromSessionId)
    try {
      const parsedCandidate = JSON.parse(candidate)
      if (sessionId) {
        connection?.addIceCandidateForOutputPeer(sessionId, parsedCandidate)
      } else {
        connection?.addIceCandidate(parsedCandidate)
      }
    } catch (e) {}

    callback(null, {})
  },
  ListenSignal(call) {
    registerDispatchSignal(signal => {
      call.write(signal)
    })
    // const connection = connections.getConnectionById(call.request.sessionId)
    // if (!connection) {
    //   call.end()
    //   return
    // }
    // connection.registerCandidateHandler(candidate => {
    //   const str = JSON.stringify(candidate)
    //   call.write({ candidate: str })
    // })
    // connection.exitCandidate = () => {
    //   call.end()
    // }
  },
  Answer(call, callback) {
    callback(null, {})
    const { channelId, sessionId, fromSessionId, sdp } = call.request
    const channel = channels.getChannelById(channelId)
    if (!channel) return
    const connection = channel.getConnectionById(fromSessionId)
    if (!connection) return
    connection.receiveAnswer(sessionId, sdp)
  },
  Leave(call, callback) {
    callback(null, {})
    const { channelId, sessionId } = call.request
    const channel = channels.getChannelById(channelId)
    const connection = channel?.getConnectionById(sessionId)
    connection?.dispose()
  },
}

const port = process.env.PORT ?? '50000'

server.addService(proto.mooyaho.Mooyaho.service, mooyahoServer)
server.bindAsync(
  `localhost:${port}`,
  ServerCredentials.createInsecure(),
  (err, port) => {
    server.start()
    console.log(`Running server on ${port}...`)
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
