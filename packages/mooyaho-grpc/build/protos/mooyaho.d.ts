import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';
import type { MooyahoClient as _mooyaho_MooyahoClient, MooyahoDefinition as _mooyaho_MooyahoDefinition } from './mooyaho/Mooyaho';
declare type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
    new (...args: ConstructorParameters<Constructor>): Subtype;
};
export interface ProtoGrpcType {
    mooyaho: {
        Empty: MessageTypeDefinition;
        Mooyaho: SubtypeConstructor<typeof grpc.Client, _mooyaho_MooyahoClient> & {
            service: _mooyaho_MooyahoDefinition;
        };
        Signal: MessageTypeDefinition;
    };
}
export {};
