export interface EventMap {
  connected: { sessionId: string }
  entered: { sessionId: string; self: boolean; sfuEnabled: boolean }
}
export type EventType = keyof EventMap
