import grpc from "grpc";
import { MooyahoClient } from "mooyaho-grpc/src/protos/mooyaho_grpc_pb";
import { Signal } from "mooyaho-grpc/src/protos/mooyaho_pb";

export class Client {
  client: MooyahoClient;
  constructor(address: string) {
    this.client = new MooyahoClient(address, grpc.credentials.createInsecure());
  }

  call({ sessionId, sdp }: CallParams) {
    const signal = new Signal();
    signal.setSessionid(sessionId);
    signal.setSdp(sdp);
    signal.setType("offer");

    return new Promise<string>((resolve, reject) => {
      this.client.call(signal, (error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.getSdp());
      });
    });
  }
}

type CallParams = {
  sessionId: string;
  sdp: string;
};

type Answer = {};
