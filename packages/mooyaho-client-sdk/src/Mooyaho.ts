import EventEmitter from 'eventemitter3'
import { EventMap, EventType, LocalEventMap, LocalEventType } from './Events'
import {
  CandidatedAction,
  SendAction as ServerSentAction,
} from 'mooyaho-engine/src/lib/websocket/actions/send'
import { ReceiveAction } from '../../mooyaho-engine/src/lib/websocket/actions/receive'
import { waitUntil } from './utils/waitUntil'

const rtcConfiguration = {}

class Mooyaho {
  socket: WebSocket | null = null
  sessionId: string | null = null
  sfuEnabled = false
  channelId: string = ''
  peers = new Map<string, RTCPeerConnection>()

  initialSessionId: string | null = null
  sessionToken: string | null = null
  private myStream: MediaStream | null = null
  private remoteStreams = new Map<string, MediaStream>()

  // peer connection for sending current users stream to SFU
  private sfuLocalPeer: RTCPeerConnection | null = null

  private events = new EventEmitter()
  private localEvents = new EventEmitter<LocalEventMap>()
  sessions: Map<string, { id: string; user: any }> = new Map()

  private cancelConnect: (() => void) | null = null

  get sessionsArray() {
    return Array.from(this.sessions.values())
  }

  private connected = false
  // this is true until it gets disposed after connection
  private connectedState = false

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
        this.handleConnected(action.id, action.token)
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
        this.handleCalled(action.from, action.sdp, action.isSFU)
        break
      case 'answered':
        // call handleAnswered when isSFU is false
        this.handleAnswered(action)
        break
      case 'candidated':
        this.handleCandidated(action)
        break
      case 'listSessionsSuccess':
        this.handleListSessionsSuccess(action.sessions)
        break
      case 'reuseIdSuccess':
        this.handleReuseIdSuccess()
        break
      default:
        console.log('Unhandled action: ', action)
        break
    }
  }

  private handleConnected(sessionId: string, sessionToken: string) {
    this.connected = true
    this.connectedState = true
    this.sessionId = sessionId
    if (!this.sessionToken) {
      this.initialSessionId = sessionId
      this.sessionToken = sessionToken
    }
    this.emit('connected', { sessionId })
  }

  private async handleEnterSuccess(sfuEnabled: boolean) {
    this.sfuEnabled = sfuEnabled

    const result = await this.getSessions()

    // store sessions to sessions map
    result.sessions.forEach(session => {
      this.sessions.set(session.id, session)
    })

    if (sfuEnabled) {
      this.sfuCall()
    }

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

  private handleCalled(sessionId: string, sdp: string, isSFU?: boolean) {
    if (isSFU) {
      this.sfuAnswer(sessionId, sdp)
    } else {
      this.answer(sessionId, sdp)
    }
  }

  // find peer by from
  // print error if peer does not exist and return
  // set remote description to peer
  // and print that setting remote description has succeeded
  private handleAnswered(
    params:
      | {
          from: string
          sdp: string
          isSFU: false
        }
      | {
          sdp: string
          isSFU: true
        }
  ) {
    if (!params.isSFU) {
      const peer = this.peers.get(params.from)
      if (!peer) {
        console.error('Peer does not exist')
        return
      }
      peer.setRemoteDescription({ type: 'answer', sdp: params.sdp })
    } else {
      if (!this.sfuLocalPeer) {
        console.error('sfuLocalPeer does not exist')
        return
      }
      this.sfuLocalPeer.setRemoteDescription({
        type: 'answer',
        sdp: params.sdp,
      })
    }
  }

  private handleCandidated(action: CandidatedAction) {
    if (action.isSFU && !action.from) {
      this.sfuLocalPeer?.addIceCandidate(action.candidate)
      return
    }

    const peer = this.peers.get(action.from!)
    if (!peer) {
      console.error('Peer does not exist')
      return
    }
    peer.addIceCandidate(action.candidate)
  }

  private handleListSessionsSuccess(sessions: { id: string; user: any }[]) {
    this.localEvents.emit('listSessions', { sessions })
  }

  private handleReuseIdSuccess() {
    this.emit('reconnected', { sessionId: this.sessionId! })
    // re-enter channel if exists
    if (this.channelId !== '') {
      this.enter(this.channelId)
    }
  }

  private send(action: ReceiveAction) {
    if (!this.socket) return
    this.socket.send(JSON.stringify(action))
  }

  private async call(sessionId: string) {
    const peer = new RTCPeerConnection(rtcConfiguration)
    this.peers.set(sessionId, peer)

    peer.addEventListener('icecandidate', event => {
      this.icecandidate(sessionId, event.candidate)
    })
    peer.addEventListener('track', event => {
      this.remoteStreams.set(sessionId, event.streams[0])
      this.emit('remoteStreamChanged', { sessionId })
    })
    peer.addEventListener('connectionstatechange', e => {
      if (peer.connectionState === 'connected') {
        this.emit('peerConnected', {
          sessionId,
          peer,
        })
      }
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
    if (this.channelId === '' && !this.config.allowDirectCall) return
    if (this.config.allowDirectCall && this.peers.size === 1) return

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
      this.icecandidate(sessionId, event.candidate)
    })

    peer.addEventListener('connectionstatechange', e => {
      if (peer.connectionState === 'connected') {
        this.emit('peerConnected', {
          sessionId,
          peer,
        })
      }
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

  async sfuCall() {
    const sfuLocalPeer = new RTCPeerConnection(rtcConfiguration)
    this.sfuLocalPeer = sfuLocalPeer

    sfuLocalPeer.addEventListener('icecandidate', event => {
      this.sfuIceCandidate(event.candidate)
    })

    sfuLocalPeer.addEventListener('connectionstatechange', e => {
      if (sfuLocalPeer.connectionState === 'connected') {
        this.emit('sfuPeerConnected', {
          peer: sfuLocalPeer,
        })
      }
    })

    const myStream = this.myStream
    if (myStream) {
      const tracks = myStream.getTracks()
      for (const track of tracks) {
        sfuLocalPeer.addTrack(track, myStream)
      }
    }

    const offer = await sfuLocalPeer.createOffer()
    sfuLocalPeer.setLocalDescription(offer)
    this.send({
      type: 'call',
      isSFU: true,
      sdp: offer.sdp!,
    })
  }

  async sfuAnswer(sessionId: string, sdp: string) {
    const peer = new RTCPeerConnection(rtcConfiguration)
    this.peers.set(sessionId, peer)

    peer.addEventListener('icecandidate', event => {
      this.sfuIceCandidate(event.candidate, sessionId)
    })

    peer.addEventListener('track', event => {
      this.remoteStreams.set(sessionId, event.streams[0])
      this.emit('remoteStreamChanged', { sessionId })
    })

    peer.addEventListener('connectionstatechange', e => {
      if (peer.connectionState === 'connected') {
        this.emit('peerConnected', {
          sessionId,
          peer,
        })
      }
    })

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
      isSFU: true,
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

  reuseSession() {
    const { initialSessionId, sessionToken } = this
    if (!initialSessionId || !sessionToken) return

    this.send({
      type: 'reuseId',
      id: initialSessionId,
      token: sessionToken,
    })
  }

  async connect() {
    const socket = new WebSocket(`${this.config.url}/websocket`)
    this.socket = socket

    socket.addEventListener('close', () => {
      this.connected = false
      if (this.connectedState) {
        // @todo: increase retry delay if fails again
        setTimeout(() => {
          this.cancelConnect?.()
          this.connect()
            .then(() => {
              this.sessions.clear()
              this.reuseSession()
            })
            .catch(e => {})
        }, 1000)
      }
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

    let _resolve: () => void = () => {}
    try {
      const cancelled = new Promise<void>((resolve, reject) => {
        _resolve = resolve
        this.cancelConnect = reject
      })
      await Promise.race([this.waitUntilConnected(), cancelled])
      this.cancelConnect = null
      _resolve()
    } catch (e) {}
    return this.sessionId!
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
      isSFU: false,
    })
  }

  sfuIceCandidate(candidate: any, to?: string) {
    this.send({
      type: 'candidate',
      isSFU: true,
      candidate,
      to,
    })
  }

  leave() {
    this.send({
      type: 'leave',
    })
    this.reset()
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

  // disconnect all peers
  // reinitialize all member variables
  reset() {
    this.peers.forEach(peer => {
      peer.close()
    })
    this.peers.clear()
    this.remoteStreams.clear()
    this.channelId = ''
    this.sfuLocalPeer?.close()
    this.sfuLocalPeer = null
  }

  directCall(sessionId: string) {
    if (!this.config.allowDirectCall) {
      console.error('Please activate allowDirectCall in your config')
      return
    }
    return this.call(sessionId)
  }

  dispose() {
    this.connectedState = false
    this.connected = false
    this.reset()
    this.socket?.close()
  }

  // to test websocket reconnection
  manuallyDisconnect() {
    this.socket?.close()
  }
}

export interface MooyahoConfig {
  url: string
  allowDirectCall?: boolean
}

export default Mooyaho
