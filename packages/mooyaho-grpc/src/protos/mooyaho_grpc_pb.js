// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var mooyaho_pb = require('./mooyaho_pb.js');

function serialize_mooyaho_Empty(arg) {
  if (!(arg instanceof mooyaho_pb.Empty)) {
    throw new Error('Expected argument of type mooyaho.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mooyaho_Empty(buffer_arg) {
  return mooyaho_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mooyaho_Signal(arg) {
  if (!(arg instanceof mooyaho_pb.Signal)) {
    throw new Error('Expected argument of type mooyaho.Signal');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mooyaho_Signal(buffer_arg) {
  return mooyaho_pb.Signal.deserializeBinary(new Uint8Array(buffer_arg));
}


var MooyahoService = exports.MooyahoService = {
  call: {
    path: '/mooyaho.Mooyaho/Call',
    requestStream: false,
    responseStream: false,
    requestType: mooyaho_pb.Signal,
    responseType: mooyaho_pb.Signal,
    requestSerialize: serialize_mooyaho_Signal,
    requestDeserialize: deserialize_mooyaho_Signal,
    responseSerialize: serialize_mooyaho_Signal,
    responseDeserialize: deserialize_mooyaho_Signal,
  },
  icecandidate: {
    path: '/mooyaho.Mooyaho/Icecandidate',
    requestStream: false,
    responseStream: false,
    requestType: mooyaho_pb.Signal,
    responseType: mooyaho_pb.Empty,
    requestSerialize: serialize_mooyaho_Signal,
    requestDeserialize: deserialize_mooyaho_Signal,
    responseSerialize: serialize_mooyaho_Empty,
    responseDeserialize: deserialize_mooyaho_Empty,
  },
};

exports.MooyahoClient = grpc.makeGenericClientConstructor(MooyahoService);
