import Channel from './Channel'
import { RTCPeerConnection, MediaStream, RTCIceCandidate } from 'wrtc'
import getDispatchSignal from '../getDispatchSignal'

export default class Connection {
  channel: Channel | null = null
  peerConnection: RTCPeerConnection | null = null
  stream: MediaStream | null = null
  outputPeerConnections = new Map<string, RTCPeerConnection>()
  outputPeerCandidateQueue = new Map<string, RTCIceCandidate[]>()

  constructor(public id: string) {}

  async call(connection: Connection) {
    const { stream } = connection
    if (!stream) return

    const peer = new RTCPeerConnection()
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
    const peer = new RTCPeerConnection()
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
      if (peer.connectionState === 'connected') {
        const connections = this.channel!.getConnectionsExcept(this.id)
        // TODO: (1) 채널에 있는 다른 세션들의 스트림을 보낼 수 있도록 각 세션마다 SFU -> Client (본인)로 전화 걸기
        connections.forEach(connection => this.call(connection))

        // TODO: (2) 기존 사용자들에게 새로 전화를 걸기
      }
    })

    const answer = await peer.createAnswer()
    peer.setLocalDescription(answer)
    return answer
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

  // async setupInitialStreams() {
  //   if (!this.channel || !this.peerConnection) return
  //   const connections = this.channel!.getConnectionsExcept(this.id)
  //   const streams = await Promise.all(connections.map(c => c.getStream()))
  //   const peer = this.peerConnection

  //   streams.forEach(stream => {
  //     stream.getTracks().forEach(track => {
  //       console.log(`adding stream ${stream.id}`)
  //       peer.addTrack(track, stream)
  //     })
  //   })
  // }
}

const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t))
