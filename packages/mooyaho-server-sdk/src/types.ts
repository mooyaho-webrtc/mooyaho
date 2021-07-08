export type Channel = {
  id: string
  sfuServerId: null | number
}

export type ChannelSession = {
  sessionId: string
  user: {
    id: string
    [key: string]: any
  }
}

export type ChannelWithSessions = Channel & {
  channelSessions: ChannelSession[]
}
