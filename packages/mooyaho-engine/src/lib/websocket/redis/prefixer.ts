const prefixer = {
  channel: (channel: string) => `channel:${channel}`,
  sessions: (channel: string) => `${prefixer.channel(channel)}:sessions`,
  direct: (sessionId: string) => `direct:${sessionId}`,
}

export default prefixer
