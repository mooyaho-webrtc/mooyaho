import Channel from './Channel'
import { RTCPeerConnection } from 'wrtc'

export default class Connection {
  channel: Channel | null = null
  peerConnection: RTCPeerConnection | null = null

  private candidateHandler: CandidateHandler | null = null
  private unsentCandiates: any[] = []
  exitCandidate: (() => void) | null = null

  constructor(public id: string) {}

  async receiveCall(sdp: string) {
    const peer = new RTCPeerConnection({})
    this.peerConnection = peer

    await peer.setRemoteDescription({
      type: 'offer',
      sdp,
    })

    peer.addEventListener('icecandidate', e => {
      console.log(this.candidateHandler, e.candidate)
      if (this.candidateHandler) {
        this.candidateHandler(e.candidate)
      } else {
        this.unsentCandiates.push(e.candidate)
      }
    })

    const answer = await peer.createAnswer()

    peer.setLocalDescription(answer)
    return answer
  }

  addIceCandidate(candidate: any) {
    if (!this.peerConnection || !candidate) return
    this.peerConnection.addIceCandidate(candidate)
    console.log('Added candidate', candidate)
  }

  registerCandidateHandler(handler: CandidateHandler) {
    this.candidateHandler = handler
    if (this.unsentCandiates.length > 0) {
      this.unsentCandiates.forEach(handler)
    }
  }
}

type CandidateHandler = (candidate: any) => void
