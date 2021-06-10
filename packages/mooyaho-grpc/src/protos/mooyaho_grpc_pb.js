// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var mooyaho_pb = require('./mooyaho_pb.js');

function serialize_mooyaho_CallReply(arg) {
  if (!(arg instanceof mooyaho_pb.CallReply)) {
    throw new Error('Expected argument of type mooyaho.CallReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mooyaho_CallReply(buffer_arg) {
  return mooyaho_pb.CallReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_mooyaho_CallRequest(arg) {
  if (!(arg instanceof mooyaho_pb.CallRequest)) {
    throw new Error('Expected argument of type mooyaho.CallRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_mooyaho_CallRequest(buffer_arg) {
  return mooyaho_pb.CallRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var MooyahoService = exports.MooyahoService = {
  call: {
    path: '/mooyaho.Mooyaho/Call',
    requestStream: false,
    responseStream: false,
    requestType: mooyaho_pb.CallRequest,
    responseType: mooyaho_pb.CallReply,
    requestSerialize: serialize_mooyaho_CallRequest,
    requestDeserialize: deserialize_mooyaho_CallRequest,
    responseSerialize: serialize_mooyaho_CallReply,
    responseDeserialize: deserialize_mooyaho_CallReply,
  },
};

exports.MooyahoClient = grpc.makeGenericClientConstructor(MooyahoService);
