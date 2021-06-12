// package: mooyaho
// file: mooyaho.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Signal extends jspb.Message { 
    getType(): string;
    setType(value: string): Signal;
    getSessionid(): string;
    setSessionid(value: string): Signal;
    getSdp(): string;
    setSdp(value: string): Signal;
    getCandidate(): string;
    setCandidate(value: string): Signal;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Signal.AsObject;
    static toObject(includeInstance: boolean, msg: Signal): Signal.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Signal, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Signal;
    static deserializeBinaryFromReader(message: Signal, reader: jspb.BinaryReader): Signal;
}

export namespace Signal {
    export type AsObject = {
        type: string,
        sessionid: string,
        sdp: string,
        candidate: string,
    }
}

export class Empty extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Empty.AsObject;
    static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Empty;
    static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
    export type AsObject = {
    }
}
