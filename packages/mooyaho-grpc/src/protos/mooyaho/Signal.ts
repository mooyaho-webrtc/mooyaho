// Original file: protos/mooyaho.proto


export interface Signal {
  'type'?: (string);
  'sessionId'?: (string);
  'sdp'?: (string);
  'candidate'?: (string);
  'channelId'?: (string);
  'fromSessionId'?: (string);
}

export interface Signal__Output {
  'type': (string);
  'sessionId': (string);
  'sdp': (string);
  'candidate': (string);
  'channelId': (string);
  'fromSessionId': (string);
}
