export interface EventMap {
  connected: { sessionId: string }
  enterSuccess: { sfuEnabled: boolean }
  entered: { sessionId: string; user: any; isSelf: boolean }
  left: { sessionId: string }
  remoteStreamChanged: { sessionId: string }
  sfuPeerConnected: { peer: RTCPeerConnection }
  peerConnected: { sessionId: string; peer: RTCPeerConnection }
  reconnected: { sessionId: string }
}

export type EventType = keyof EventMap

export interface LocalEventMap {
  listSessions: {
    sessions: { id: string; user: any }[]
  }
}
export type LocalEventType = keyof LocalEventMap
