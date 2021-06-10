// package: mooyaho
// file: mooyaho.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as mooyaho_pb from "./mooyaho_pb";

interface IMooyahoService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    call: IMooyahoService_ICall;
}

interface IMooyahoService_ICall extends grpc.MethodDefinition<mooyaho_pb.CallRequest, mooyaho_pb.CallReply> {
    path: "/mooyaho.Mooyaho/Call";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<mooyaho_pb.CallRequest>;
    requestDeserialize: grpc.deserialize<mooyaho_pb.CallRequest>;
    responseSerialize: grpc.serialize<mooyaho_pb.CallReply>;
    responseDeserialize: grpc.deserialize<mooyaho_pb.CallReply>;
}

export const MooyahoService: IMooyahoService;

export interface IMooyahoServer {
    call: grpc.handleUnaryCall<mooyaho_pb.CallRequest, mooyaho_pb.CallReply>;
}

export interface IMooyahoClient {
    call(request: mooyaho_pb.CallRequest, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
    call(request: mooyaho_pb.CallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
    call(request: mooyaho_pb.CallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
}

export class MooyahoClient extends grpc.Client implements IMooyahoClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public call(request: mooyaho_pb.CallRequest, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
    public call(request: mooyaho_pb.CallRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
    public call(request: mooyaho_pb.CallRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.CallReply) => void): grpc.ClientUnaryCall;
}
