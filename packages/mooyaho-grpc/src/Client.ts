import * as grpc from '@grpc/grpc-js'
import proto from '.'
import { MooyahoClient } from './protos/mooyaho/Mooyaho'
import { promisify } from 'util'
import { Signal } from './protos/mooyaho/Signal'

export class Client {
  client: MooyahoClient
  constructor(address: string) {
    this.client = new proto.mooyaho.Mooyaho(
      address,
      grpc.credentials.createInsecure()
    )
  }

  async call({ sessionId, sdp, channelId }: CallParams) {
    const callAsync = promisify(this.client.call).bind(this.client)
    const res = await callAsync({
      sessionId,
      sdp,
      channelId,
    })
    return res!.sdp
  }

  async clientIcecandidate({ sessionId, candidate }: ClientIcecandidateParams) {
    this.client.clientIcecandidate(
      {
        sessionId,
        candidate,
      },
      () => {}
    )
  }

  async listenSignal(sessionId: string, callback: (candidate: string) => void) {
    const call = this.client.listenSignal({ sessionId })
    call.on('data', (signal: Signal) => {
      if (!signal.candidate) return
      callback(signal.candidate)
    })
  }
}

type CallParams = {
  sessionId: string
  sdp: string
  channelId: string
}

type ClientIcecandidateParams = {
  sessionId: string
  candidate: string
}
