// Original file: protos/mooyaho.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _mooyaho_Empty, Empty__Output as _mooyaho_Empty__Output } from '../mooyaho/Empty';
import type { Signal as _mooyaho_Signal, Signal__Output as _mooyaho_Signal__Output } from '../mooyaho/Signal';

export interface MooyahoClient extends grpc.Client {
  Call(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  
  Icecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Icecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Icecandidate(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Icecandidate(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  icecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  icecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  icecandidate(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  icecandidate(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  
}

export interface MooyahoHandlers extends grpc.UntypedServiceImplementation {
  Call: grpc.handleUnaryCall<_mooyaho_Signal__Output, _mooyaho_Signal>;
  
  Icecandidate: grpc.handleUnaryCall<_mooyaho_Signal__Output, _mooyaho_Empty>;
  
}

export interface MooyahoDefinition extends grpc.ServiceDefinition {
  Call: MethodDefinition<_mooyaho_Signal, _mooyaho_Signal, _mooyaho_Signal__Output, _mooyaho_Signal__Output>
  Icecandidate: MethodDefinition<_mooyaho_Signal, _mooyaho_Empty, _mooyaho_Signal__Output, _mooyaho_Empty__Output>
}
