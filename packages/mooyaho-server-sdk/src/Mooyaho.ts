import axios from 'axios'
import { Channel, ChannelSession, ChannelWithSessions } from './types'

const apiClient = axios.create()

class Mooyaho {
  constructor(baseUrl: string, apiKey: string) {
    apiClient.defaults.baseURL = baseUrl
    apiClient.defaults.headers['Authorization'] = `Bearer ${apiKey}`
  }

  async createChannel(isSFU?: boolean) {
    const response = await apiClient.post<Channel>('/channels', {
      sfuEnabled: isSFU,
    })
    return response.data
  }

  async deleteChannel(channelId: string) {
    await apiClient.delete(`/channels/${channelId}`)
    return true
  }

  async getChannel(channelId: string) {
    const response = await apiClient.get<ChannelWithSessions>(`/channels/${channelId}`)
    return response.data
  }

  async integrateUser(sessionId: string, user: { id: string; [key: string]: any }) {
    const response = await apiClient.post<ChannelSession>(`/sessions/${sessionId}`, user)
    return response.data
  }

  async listAllChannels() {
    const response = await apiClient.get<(Channel & { sessionCount: number })[]>('/channels')
    return response.data
  }

  async bulkDeleteChannels(channelIds: string[]) {
    await apiClient.post(`/channels/bulk-delete`, channelIds)
    return true
  }
}

export default Mooyaho
