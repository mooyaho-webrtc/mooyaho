import * as grpc from '@grpc/grpc-js'
import proto from '.'
import { MooyahoClient } from './protos/mooyaho/Mooyaho'
import { promisify } from 'util'

export class Client {
  client: MooyahoClient
  constructor(address: string) {
    this.client = new proto.mooyaho.Mooyaho(
      address,
      grpc.credentials.createInsecure()
    )
  }

  async call({ sessionId, sdp }: CallParams) {
    const callAsync = promisify(this.client.call).bind(this.client)
    const res = await callAsync({
      sessionId,
      sdp,
    })
    return res!.sdp
  }
}

type CallParams = {
  sessionId: string
  sdp: string
}
