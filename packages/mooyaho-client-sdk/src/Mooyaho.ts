import EventEmitter from 'eventemitter3'
import { EventMap, EventType, LocalEventMap, LocalEventType } from './Events'
import { SendAction as ServerSentAction } from 'mooyaho-engine/src/lib/websocket/actions/send'
import { ReceiveAction } from '../../mooyaho-engine/src/lib/websocket/actions/receive'
import { waitUntil } from './utils/waitUntil'

const rtcConfiguration = {}

class Mooyaho {
  socket: WebSocket | null = null
  sessionId: string | null = null
  sfuEnabled = false
  channelId: string = ''
  peers = new Map<string, RTCPeerConnection>()
  private myStream: MediaStream | null = null
  private remoteStreams = new Map<string, MediaStream>()

  private events = new EventEmitter()
  private localEvents = new EventEmitter<LocalEventMap>()
  sessions: Map<string, { id: string; user: any }> = new Map()

  get sessionsArray() {
    return Array.from(this.sessions.values())
  }

  private connected = false

  constructor(private config: MooyahoConfig) {}

  public getMyStream() {
    return this.myStream
  }

  public getRemoteStreamById(sessionId: string) {
    return this.remoteStreams.get(sessionId)
  }

  async createUserMedia(constraints: MediaStreamConstraints) {
    if (this.myStream) {
      return Promise.resolve(this.myStream)
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.myStream = stream
    return stream
  }

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
      case 'called':
        this.handleCalled(action.from, action.sdp)
        break
      case 'answered':
        // call handleAnswered when isSFU is false
        if (!action.isSFU) {
          this.handleAnswered(action.from, action.sdp)
        }
        break
      case 'candidated':
        this.handleCandidated(action.from, action.candidate)
        break
      case 'listSessionsSuccess':
        this.handleListSessionsSuccess(action.sessions)
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

  private async handleEnterSuccess(sfuEnabled: boolean) {
    this.sfuEnabled = sfuEnabled

    const result = await this.getSessions()

    // store sessions to sessions map
    result.sessions.forEach(session => {
      this.sessions.set(session.id, session)
    })

    this.emit('enterSuccess', { sfuEnabled })
  }

  private handleEntered(sessionId: string, user: any) {
    // call if it is not self
    if (sessionId !== this.sessionId) {
      this.call(sessionId)
      // put user in sessions with session id as key
      this.sessions.set(sessionId, { id: sessionId, user })
    }

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

    // get peer connection by session id
    // and disconnect peer
    // remove from peers
    const peer = this.peers.get(sessionId)
    if (peer) {
      peer.close()
      this.peers.delete(sessionId)
    }

    // remove from sessions
    this.sessions.delete(sessionId)
  }

  private handleCalled(sessionId: string, sdp: string) {
    this.answer(sessionId, sdp)
  }

  // find peer by from
  // print error if peer does not exist and return
  // set remote description to peer
  // and print that setting remote description has succeeded
  private handleAnswered(from: string, sdp: string) {
    const peer = this.peers.get(from)
    if (!peer) {
      console.error('Peer does not exist')
      return
    }
    peer.setRemoteDescription({ type: 'answer', sdp })
    console.log('Setting remote description succeeded')
  }

  private handleCandidated(from: string, candidate: any) {
    const peer = this.peers.get(from)
    if (!peer) {
      console.error('Peer does not exist')
      return
    }
    peer.addIceCandidate(candidate)
  }

  private handleListSessionsSuccess(sessions: { id: string; user: any }[]) {
    this.localEvents.emit('listSessions', { sessions })
  }

  private send(action: ReceiveAction) {
    if (!this.socket) return
    this.socket.send(JSON.stringify(action))
  }

  private async call(sessionId: string) {
    const peer = new RTCPeerConnection(rtcConfiguration)
    this.peers.set(sessionId, peer)

    peer.addEventListener('icecandidate', event => {
      console.log('hello')
      this.icecandidate(sessionId, event.candidate)
    })
    peer.addEventListener('connectionstatechange', event => {
      console.log(peer.connectionState)
    })
    peer.addEventListener('track', event => {
      this.remoteStreams.set(sessionId, event.streams[0])
      this.emit('remoteStreamChanged', { sessionId })
    })

    // put tracks of myStream into peer
    if (this.myStream) {
      const tracks = this.myStream.getTracks()
      for (const track of tracks) {
        peer.addTrack(track, this.myStream)
      }
    }

    // create offer and send it using this.send
    const offer = await peer.createOffer()

    // set local description
    peer.setLocalDescription(offer)

    this.send({
      type: 'call',
      to: sessionId,
      sdp: offer.sdp!,
    })
  }

  private async answer(sessionId: string, sdp: string) {
    // create peer and store to peers
    const peer = new RTCPeerConnection(rtcConfiguration)
    this.peers.set(sessionId, peer)

    // store stream to remoteStreams when track changes
    peer.addEventListener('track', event => {
      this.remoteStreams.set(sessionId, event.streams[0])
      this.emit('remoteStreamChanged', { sessionId })
    })

    // do icecandidate
    peer.addEventListener('icecandidate', event => {
      console.log('world')
      this.icecandidate(sessionId, event.candidate)
    })

    // put tracks of myStream into peer
    if (this.myStream) {
      const tracks = this.myStream.getTracks()
      for (const track of tracks) {
        peer.addTrack(track, this.myStream)
      }
    }

    // set remote description
    peer.setRemoteDescription({ type: 'offer', sdp })

    // create answer and send it using this.send
    const answer = await peer.createAnswer()

    // set local description
    peer.setLocalDescription(answer)

    // send answer
    this.send({
      type: 'answer',
      to: sessionId,
      sdp: answer.sdp!,
    })
  }

  private emit<K extends EventType>(type: K, event: EventMap[K]) {
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

  icecandidate(to: string, candidate: any) {
    this.send({
      type: 'candidate',
      to,
      candidate,
    })
  }

  leave() {
    this.send({
      type: 'leave',
    })
  }

  getSessions() {
    this.send({
      type: 'listSessions',
    })
    return new Promise<LocalEventMap['listSessions']>(resolve => {
      this.localEvents.once(
        'listSessions',
        (e: LocalEventMap['listSessions']) => {
          resolve(e)
        }
      )
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
