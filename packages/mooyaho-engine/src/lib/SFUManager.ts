import { Client } from '@mooyaho/grpc'
import sfuServerService from '../services/sfuServerService'
import prisma from './prisma'
import actionCreators from './websocket/actions/send'
import { localSubscriber } from './websocket/redis/createRedisClient'
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
    this.subscribeSFUCreated()
  }

  private startListenSignal(client: Client) {
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

  private async addClient(id: number) {
    const sfuServer = await sfuServerService.getSFUServerById(id)
    if (!sfuServer) {
      console.error('SFUServer is not yet registered to database')
      return
    }

    if (this.sfuClientMap.has(id)) {
      console.info('SFUClient is already registered')
      return
    }

    const client = new Client(sfuServer.address)
    this.sfuClientMap.set(id, client)
    this.startListenSignal(client)
    console.log(`Adding SFU Server ${id}`)
  }

  private async subscribeSFUCreated() {
    localSubscriber.subscribe('sfu_created')
    localSubscriber.on('message', (channel, message) => {
      console.log(message)
      if (channel !== 'sfu_created') return

      try {
        const serverId = parseInt(message)
        if (isNaN(serverId)) {
          console.error(`${serverId} is NaN`)
          return
        }
        this.addClient(serverId)
      } catch (e) {
        console.error(
          `Failed to parse message from redis subscription "${message}"`
        )
      }
    })
  }
}

export default SFUManager
