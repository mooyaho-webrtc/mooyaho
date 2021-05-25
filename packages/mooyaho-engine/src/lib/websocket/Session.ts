import { v4 } from 'uuid'
import WebSocket = require('ws')
import { Message, ReceiveAction } from './actions/receive'
import actionCreators from './actions/send'
import { createHmac } from 'crypto'
import { globalSubscriber } from './redis/createRedisClient'
import subscription from './redis/subscription'
import channelHelper from './channelHelper'
import prefixer from './redis/prefixer'
import rtcHelper from './rtcHelper'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  id: string
  private token: string
  private currentChannel: string | null = null
  private unsubscriptionMap = new Map<string, () => void>()

  constructor(private socket: WebSocket) {
    this.id = v4()
    this.token = createHmac('sha256', SESSION_SECRET_KEY!)
      .update(this.id)
      .digest('hex')

    this.informConnected()
  }

  sendJSON(data: any) {
    this.socket.send(JSON.stringify(data))
  }

  private informConnected() {
    const action = actionCreators.connected(this.id, this.token)
    this.sendJSON(action)
  }

  handle(action: ReceiveAction) {
    switch (action.type) {
      case 'getId': {
        this.handleGetId()
        break
      }
      case 'reuseId': {
        break
      }
      case 'subscribe': {
        this.handleSubscribe(action.key)
        break
      }
      case 'unsubscribe': {
        this.handleUnsubscribe(action.key)
        break
      }
      case 'enter': {
        this.handleEnter(action.channel)
        break
      }
      case 'leave': {
        this.handleLeave()
        break
      }
      case 'message': {
        this.handleMessage(action.message)
        break
      }
      case 'listSessions': {
        this.handleListSessions()
        break
      }
      case 'call': {
        this.handleCall(action.to)
        break
      }
      case 'answer': {
        this.handleCallReceive(action.to)
        break
      }
      case 'candidate': {
        this.handleCandidate(action.to)
        break
      }
    }
  }

  subscribe(key: string) {
    const unsubscribe = subscription.subscribe(key, this)
    this.unsubscriptionMap.set(key, unsubscribe)
  }

  unsubscribe(key: string) {
    const unsubscribe = this.unsubscriptionMap.get(key)
    unsubscribe?.()
    this.unsubscriptionMap.delete(key)
  }

  private handleGetId() {
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJSON(action)
  }

  private handleSubscribe(key: string) {
    this.subscribe(key)
    const action = actionCreators.subscriptionSuccess(key)
    this.sendJSON(action)
  }

  private handleUnsubscribe(key: string) {
    this.unsubscribe(key)
  }

  private handleEnter(channel: string) {
    this.subscribe(prefixer.channel(channel))
    this.subscribe(prefixer.direct(this.id))

    channelHelper.enter(channel, this.id)
    this.currentChannel = channel
  }

  private handleLeave() {
    if (!this.currentChannel) return
    this.unsubscribe(prefixer.channel(this.currentChannel))
    this.unsubscribe(prefixer.direct(this.id))

    channelHelper.leave(this.currentChannel, this.id)
    this.currentChannel = null
  }

  private handleMessage(message: Message) {
    if (!this.currentChannel) return
    channelHelper.message(this.currentChannel, this.id, message)
  }

  async handleListSessions() {
    if (!this.currentChannel) return
    try {
      const sessions = await channelHelper.listSessions(this.currentChannel)
      this.sendJSON(actionCreators.listSessionsSuccess(sessions))
    } catch (e) {
      console.error(e)
    }
  }

  handleCall(to: string) {
    rtcHelper.call({
      from: this.id,
      to,
    })
  }

  handleCallReceive(to: string) {
    rtcHelper.answer({
      from: this.id,
      to,
    })
  }

  handleCandidate(to: string) {
    rtcHelper.candidate({
      from: this.id,
      to,
    })
  }

  public sendSubscriptionMessage(key: string, message: any) {
    // const action = actionCreators.subscriptionMessage(key, message)
    this.sendJSON(message)
  }

  dispose() {
    const fns = Array.from(this.unsubscriptionMap.values())
    fns.forEach(fn => fn())
    // remove from channel
    if (!this.currentChannel) return
    channelHelper.leave(this.currentChannel, this.id)
  }
}

export default Session
