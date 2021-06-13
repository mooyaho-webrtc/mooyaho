import { MooyahoClient } from './protos/mooyaho/Mooyaho';
export declare class Client {
    client: MooyahoClient;
    constructor(address: string);
    call({ sessionId, sdp }: CallParams): Promise<string>;
}
declare type CallParams = {
    sessionId: string;
    sdp: string;
};
export {};
