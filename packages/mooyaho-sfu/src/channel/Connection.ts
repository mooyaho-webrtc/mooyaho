import Channel from './Channel'
import { RTCPeerConnection, MediaStream, RTCIceCandidate } from 'wrtc'
import getDispatchSignal from '../getDispatchSignal'

const config = {}

export default class Connection {
  channel: Channel | null = null
  peerConnection: RTCPeerConnection | null = null
  stream: MediaStream | null = null
  outputPeerConnections = new Map<string, RTCPeerConnection>()
  outputPeerCandidateQueue = new Map<string, RTCIceCandidate[]>()
  isConnected = false

  constructor(public id: string) {}

  async call(connection: Connection) {
    const { stream } = connection
    if (!stream) return

    const peer = new RTCPeerConnection(config)

    this.outputPeerConnections.set(connection.id, peer)
    peer.addEventListener('icecandidate', e => {
      if (!e.candidate) return
      const dispatch = getDispatchSignal()

      dispatch({
        type: 'icecandidate',
        sessionId: this.id,
        candidate: JSON.stringify(e.candidate),
        fromSessionId: connection.id,
      })
    })

    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream)
    })

    const offer = await peer.createOffer()
    const dispatch = getDispatchSignal()
    peer.setLocalDescription(offer)

    dispatch({
      type: 'offer',
      sessionId: this.id,
      fromSessionId: connection.id,
      sdp: offer.sdp,
    })
  }

  async receiveCall(sdp: string) {
    const peer = new RTCPeerConnection(config)
    this.peerConnection = peer

    peer.addEventListener('track', e => {
      const stream = e.streams[0]
      this.stream = stream
    })

    await peer.setRemoteDescription({
      type: 'offer',
      sdp,
    })

    peer.addEventListener('icecandidate', e => {
      if (!e.candidate) return
      // ensures answer first!
      setTimeout(() => {
        const dispatch = getDispatchSignal()
        dispatch({
          type: 'icecandidate',
          sessionId: this.id,
          candidate: JSON.stringify(e.candidate),
        })
      }, 50)
    })

    peer.addEventListener('connectionstatechange', e => {
      console.log(peer.connectionState)
      if (peer.connectionState === 'connected' && !this.isConnected) {
        this.isConnected = true
        const connections = this.channel!.getConnectionsExcept(this.id)
        // (1) send other's stream to this peer
        connections.forEach(connection => this.call(connection))
        // (2) send this peer's stream to other users
        connections.forEach(connection => connection.call(this))
      } else if (peer.connectionState === 'failed' && this.isConnected) {
        this.dispose()
        // remove this connection from SFU
      }
    })

    const answer = await peer.createAnswer()
    peer.setLocalDescription(answer)
    return answer
  }

  dispose() {
    this.isConnected = false
    this.peerConnection?.close()
    this.outputPeerConnections.forEach(peer => peer.close())
    this.channel?.removeConnection(this)
    console.log('I am disposed...')
  }

  async receiveAnswer(sessionId: string, sdp: string) {
    const outputPeer = this.outputPeerConnections.get(sessionId)
    if (!outputPeer) return

    await outputPeer.setRemoteDescription({
      type: 'answer',
      sdp,
    })

    const queue = this.outputPeerCandidateQueue.get(sessionId) ?? []
    if (queue.length > 0) {
      queue.forEach(candidate => {
        outputPeer.addIceCandidate(candidate)
      })
    }
  }

  addIceCandidate(candidate: any) {
    if (!this.peerConnection || !candidate) return
    this.peerConnection.addIceCandidate(candidate)
  }

  addIceCandidateForOutputPeer(sessionId: string, candidate: any) {
    if (!candidate) return
    const outputPeer = this.outputPeerConnections.get(sessionId)
    if (!outputPeer) return
    const queue = this.outputPeerCandidateQueue.get(sessionId) ?? []
    if (!outputPeer.remoteDescription) {
      queue.push(candidate)
      this.outputPeerCandidateQueue.set(sessionId, queue)
    } else {
      outputPeer.addIceCandidate(candidate)
    }
    // if (!outputPeer) return
  }

  async getStream() {
    while (!this.stream) {
      await sleep(50)
    }
    return this.stream
  }

  removeFromOutputConnections(id: string) {
    const peer = this.outputPeerConnections.get(id)
    peer?.close()
    this.outputPeerConnections.delete(id)
  }
}

const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t))
