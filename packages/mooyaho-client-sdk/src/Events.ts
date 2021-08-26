export interface EventMap {
  connected: { sessionId: string }
  enterSuccess: { sfuEnabled: boolean }
  entered: { sessionId: string; user: any; isSelf: boolean }
  left: { sessionId: string }
  remoteStreamChanged: { sessionId: string }
  sfuPeerConnected: { peer: RTCPeerConnection }
  peerConnected: { sessionId: string; peer: RTCPeerConnection }
  reconnected: { sessionId: string }
  updatedMediaState: {
    sessionId: string
    key: 'muted' | 'videoOff'
    value: boolean
    isSelf: boolean
  }
}

export type EventType = keyof EventMap

export interface LocalEventMap {
  listSessions: {
    sessions: {
      id: string
      user: any
      state: { muted: false; videoOff: false }
    }[]
  }
}
export type LocalEventType = keyof LocalEventMap
