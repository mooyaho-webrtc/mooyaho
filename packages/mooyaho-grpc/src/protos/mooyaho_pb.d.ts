// package: mooyaho
// file: mooyaho.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CallRequest extends jspb.Message { 
    getValue(): string;
    setValue(value: string): CallRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CallRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CallRequest): CallRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CallRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CallRequest;
    static deserializeBinaryFromReader(message: CallRequest, reader: jspb.BinaryReader): CallRequest;
}

export namespace CallRequest {
    export type AsObject = {
        value: string,
    }
}

export class CallReply extends jspb.Message { 
    getValue(): string;
    setValue(value: string): CallReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CallReply.AsObject;
    static toObject(includeInstance: boolean, msg: CallReply): CallReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CallReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CallReply;
    static deserializeBinaryFromReader(message: CallReply, reader: jspb.BinaryReader): CallReply;
}

export namespace CallReply {
    export type AsObject = {
        value: string,
    }
}
