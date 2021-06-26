// Original file: protos/mooyaho.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _mooyaho_Empty, Empty__Output as _mooyaho_Empty__Output } from '../mooyaho/Empty';
import type { Signal as _mooyaho_Signal, Signal__Output as _mooyaho_Signal__Output } from '../mooyaho/Signal';

export interface MooyahoClient extends grpc.Client {
  Answer(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Answer(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Answer(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  Answer(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  answer(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  answer(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  answer(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  answer(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  
  Call(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  Call(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  call(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Signal__Output) => void): grpc.ClientUnaryCall;
  
  ClientIcecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  ClientIcecandidate(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _mooyaho_Signal, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _mooyaho_Signal, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  clientIcecandidate(argument: _mooyaho_Signal, callback: (error?: grpc.ServiceError, result?: _mooyaho_Empty__Output) => void): grpc.ClientUnaryCall;
  
  ListenSignal(argument: _mooyaho_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_mooyaho_Signal__Output>;
  ListenSignal(argument: _mooyaho_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_mooyaho_Signal__Output>;
  listenSignal(argument: _mooyaho_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_mooyaho_Signal__Output>;
  listenSignal(argument: _mooyaho_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_mooyaho_Signal__Output>;
  
}

export interface MooyahoHandlers extends grpc.UntypedServiceImplementation {
  Answer: grpc.handleUnaryCall<_mooyaho_Signal__Output, _mooyaho_Empty>;
  
  Call: grpc.handleUnaryCall<_mooyaho_Signal__Output, _mooyaho_Signal>;
  
  ClientIcecandidate: grpc.handleUnaryCall<_mooyaho_Signal__Output, _mooyaho_Empty>;
  
  ListenSignal: grpc.handleServerStreamingCall<_mooyaho_Empty__Output, _mooyaho_Signal>;
  
}

export interface MooyahoDefinition extends grpc.ServiceDefinition {
  Answer: MethodDefinition<_mooyaho_Signal, _mooyaho_Empty, _mooyaho_Signal__Output, _mooyaho_Empty__Output>
  Call: MethodDefinition<_mooyaho_Signal, _mooyaho_Signal, _mooyaho_Signal__Output, _mooyaho_Signal__Output>
  ClientIcecandidate: MethodDefinition<_mooyaho_Signal, _mooyaho_Empty, _mooyaho_Signal__Output, _mooyaho_Empty__Output>
  ListenSignal: MethodDefinition<_mooyaho_Empty, _mooyaho_Signal, _mooyaho_Empty__Output, _mooyaho_Signal__Output>
}
