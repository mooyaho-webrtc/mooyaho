export interface EventMap {
  connected: { sessionId: string }
  enterSuccess: { sfuEnabled: boolean }
  entered: { sessionId: string; user: any; isSelf: boolean }
  left: { sessionId: string }
  remoteStreamChanged: { sessionId: string }
}
export type EventType = keyof EventMap
