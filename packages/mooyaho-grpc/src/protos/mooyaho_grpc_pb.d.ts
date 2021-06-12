// package: mooyaho
// file: mooyaho.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as mooyaho_pb from "./mooyaho_pb";

interface IMooyahoService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    call: IMooyahoService_ICall;
    icecandidate: IMooyahoService_IIcecandidate;
}

interface IMooyahoService_ICall extends grpc.MethodDefinition<mooyaho_pb.Signal, mooyaho_pb.Signal> {
    path: "/mooyaho.Mooyaho/Call";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<mooyaho_pb.Signal>;
    requestDeserialize: grpc.deserialize<mooyaho_pb.Signal>;
    responseSerialize: grpc.serialize<mooyaho_pb.Signal>;
    responseDeserialize: grpc.deserialize<mooyaho_pb.Signal>;
}
interface IMooyahoService_IIcecandidate extends grpc.MethodDefinition<mooyaho_pb.Signal, mooyaho_pb.Empty> {
    path: "/mooyaho.Mooyaho/Icecandidate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<mooyaho_pb.Signal>;
    requestDeserialize: grpc.deserialize<mooyaho_pb.Signal>;
    responseSerialize: grpc.serialize<mooyaho_pb.Empty>;
    responseDeserialize: grpc.deserialize<mooyaho_pb.Empty>;
}

export const MooyahoService: IMooyahoService;

export interface IMooyahoServer {
    call: grpc.handleUnaryCall<mooyaho_pb.Signal, mooyaho_pb.Signal>;
    icecandidate: grpc.handleUnaryCall<mooyaho_pb.Signal, mooyaho_pb.Empty>;
}

export interface IMooyahoClient {
    call(request: mooyaho_pb.Signal, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    call(request: mooyaho_pb.Signal, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    call(request: mooyaho_pb.Signal, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    icecandidate(request: mooyaho_pb.Signal, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
    icecandidate(request: mooyaho_pb.Signal, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
    icecandidate(request: mooyaho_pb.Signal, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class MooyahoClient extends grpc.Client implements IMooyahoClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public call(request: mooyaho_pb.Signal, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    public call(request: mooyaho_pb.Signal, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    public call(request: mooyaho_pb.Signal, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Signal) => void): grpc.ClientUnaryCall;
    public icecandidate(request: mooyaho_pb.Signal, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
    public icecandidate(request: mooyaho_pb.Signal, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
    public icecandidate(request: mooyaho_pb.Signal, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: mooyaho_pb.Empty) => void): grpc.ClientUnaryCall;
}
