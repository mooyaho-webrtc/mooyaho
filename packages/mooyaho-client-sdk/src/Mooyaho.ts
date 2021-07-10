import EventEmitter from 'eventemitter3'
import { EventMap, EventType } from './Events'
import { SendAction as ServerSentAction } from 'mooyaho-engine/src/lib/websocket/actions/send'
import { ReceiveAction } from '../../mooyaho-engine/src/lib/websocket/actions/receive'
import { waitUntil } from './utils/waitUntil'

class Mooyaho {
  socket: WebSocket | null = null
  sessionId: string | null = null
  sfuEnabled = false
  channelId: string = ''

  private events = new EventEmitter()

  private connected = false

  constructor(private config: MooyahoConfig) {}

  private handleSocketAction(action: ServerSentAction) {
    switch (action.type) {
      case 'connected':
        this.handleConnected(action.id)
        break
      case 'enterSuccess':
        this.handleEnterSuccess(action.sfuEnabled)
        break
      case 'entered':
        this.handleEntered(action.sessionId, action.user)
        break
      case 'left':
        this.handleLeft(action.sessionId)
        break
      default:
        console.log('Unhandled action: ', action)
        break
    }
  }

  private handleConnected(sessionId: string) {
    this.connected
    this.sessionId = sessionId
    this.emit('connected', { sessionId })
  }

  private handleEnterSuccess(sfuEnabled: boolean) {
    this.sfuEnabled = sfuEnabled
    this.emit('enterSuccess', { sfuEnabled })
  }

  private handleEntered(sessionId: string, user: any) {
    this.emit('entered', {
      sessionId,
      user,
      isSelf: sessionId === this.sessionId,
    })
  }

  private handleLeft(sessionId: string) {
    this.emit('left', {
      sessionId,
    })
  }

  private send(action: ReceiveAction) {
    console.log(action, this.socket)
    if (!this.socket) return
    this.socket.send(JSON.stringify(action))
  }

  emit<K extends EventType>(type: K, event: EventMap[K]) {
    this.events.emit(type, event)
  }

  addEventListener<K extends EventType>(
    type: K,
    listener: (event: EventMap[K]) => void
  ) {
    this.events.addListener(type, listener)
  }

  removeEventListener<K extends EventType>(
    type: K,
    listener: (event: EventMap[K]) => void
  ) {
    this.events.removeListener(type, listener)
  }

  connect() {
    const socket = new WebSocket(`${this.config.url}/websocket`)
    this.socket = socket

    socket.addEventListener('close', () => {
      this.connected = false
    })

    socket.addEventListener('message', event => {
      try {
        const parsedAction = JSON.parse(event.data)
        if (!parsedAction?.type) throw new Error('Received invalid action')
        this.handleSocketAction(parsedAction as ServerSentAction)
      } catch (e) {
        console.error(e)
        console.log(event.data)
      }
    })
  }

  enter(channelId: string) {
    this.send({
      type: 'enter',
      channel: channelId,
    })
    this.channelId = channelId
  }

  integrateUser(user: { [key: string]: any }) {
    this.send({
      type: 'integrateUser',
      user,
    })
  }

  leave() {
    this.send({
      type: 'leave',
    })
  }

  waitUntilConnected() {
    return waitUntil(() => this.connected)
  }
}

export interface MooyahoConfig {
  url: string
}

export default Mooyaho
