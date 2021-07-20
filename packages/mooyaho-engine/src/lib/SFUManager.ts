import { Client } from '../../../mooyaho-grpc/dist'
import sfuServerService from '../services/sfuServerService'
import prisma from './prisma'
import actionCreators from './websocket/actions/send'
import prefixer from './websocket/redis/prefixer'
import subscription from './websocket/redis/subscription'

class SFUManager {
  sfuClientMap = new Map<number, Client>()

  async initialize() {
    const servers = await sfuServerService.list()
    servers.forEach(server => {
      const client = new Client(server.address)
      this.sfuClientMap.set(server.id, client)
      this.startListenSignal(client)
    })
  }

  startListenSignal(client: Client) {
    client
      .listenSignal(signal => {
        if (signal.type === 'icecandidate') {
          subscription.dispatch(
            prefixer.direct(signal.sessionId),
            actionCreators.candidated(
              signal.fromSessionId!,
              JSON.parse(signal.candidate),
              true
            )
          )
        } else if (signal.type === 'offer') {
          subscription.dispatch(
            prefixer.direct(signal.sessionId),
            actionCreators.called(signal.fromSessionId, signal.sdp, true)
          )
        }
      })
      .catch(e => {
        setTimeout(() => this.startListenSignal(client), 250)
      })
  }

  getClient(id: number) {
    return this.sfuClientMap.get(id)
  }

  async getClientOf(channelId: string) {
    const sfuServer = await sfuServerService.findSFUServerOf(channelId)
    if (!sfuServer) return null
    return this.getClient(sfuServer.id)
  }
}

export default SFUManager
