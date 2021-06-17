import Channel from './Channel'

export default class ChannelManager {
  channels = new Map<string, Channel>()

  getChannelById(id: string) {
    let channel = this.channels.get(id)
    if (!channel) {
      channel = new Channel(id)
      this.channels.set(id, channel)
    }
    return channel
  }
}
