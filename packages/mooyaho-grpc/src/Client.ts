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

  async clientIcecandidate({
    fromSessionId,
    sessionId,
    candidate,
  }: ClientIcecandidateParams) {
    this.client.clientIcecandidate(
      {
        fromSessionId,
        sessionId,
        candidate,
      },
      () => {}
    )
  }

  async listenSignal(callback: (signal: CallbackSignal) => void) {
    const call = this.client.listenSignal({})

    return new Promise<void>((resolve, reject) => {
      call.on('data', (signal: Signal) => {
        callback({
          type: signal.type as any,
          candidate: signal.candidate!,
          sessionId: signal.sessionId!,
          fromSessionId: signal.fromSessionId,
          sdp: signal.sdp,
        })
      })
      call.on('error', e => {
        reject(e)
      })
      call.on('close', () => {
        resolve()
      })
    })
  }

  async answer({ sessionId, sdp, channelId, fromSessionId }: AnswerParams) {
    const answerAsync = promisify(this.client.answer).bind(this.client)
    await answerAsync({
      sessionId,
      sdp,
      channelId,
      fromSessionId,
    })
    return true
  }

  async leave({ sessionId, channelId }: LeaveParams) {
    const leaveAsync = promisify(this.client.leave).bind(this.client)
    await leaveAsync({ sessionId, channelId })
    return true
  }
}

type CallParams = {
  sessionId: string
  sdp: string
  channelId: string
}

type AnswerParams = {
  sessionId: string
  sdp: string
  channelId: string
  fromSessionId: string
}

type ClientIcecandidateParams = {
  fromSessionId: string
  sessionId?: string
  candidate: string
}

type CallbackSignal =
  | {
      type: 'icecandidate'
      sessionId: string
      candidate: string
      fromSessionId?: string
    }
  | {
      type: 'offer'
      sessionId: string
      sdp: string
      fromSessionId: string
    }

type LeaveParams = {
  channelId: string
  sessionId: string
}
