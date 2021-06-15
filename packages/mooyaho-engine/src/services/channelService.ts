import { v4 } from 'uuid'
import prisma from '../lib/prisma'

const channelService = {
  async create(sfuEnabled: boolean) {
    const id = v4()
    const channel = await prisma.channel.create({
      data: {
        id,
        sfuServerId: sfuEnabled ? 1 : undefined,
      },
    })

    return channel
  },
  async findById(id: string) {
    return prisma.channel.findUnique({
      where: {
        id,
      },
    })
  },

  async addUser(channelId: string, sessionId: string) {
    const sessionUser = await prisma.channelSession.create({
      data: {
        channelId,
        sessionId,
      },
    })
    return sessionUser
  },
  async removeUser(sessionId: string) {
    return prisma.channelSession.deleteMany({
      where: {
        sessionId,
      },
    })
  },
  async listUsers(channelId: string) {
    const channelSessions = await prisma.channelSession.findMany({
      where: {
        channelId,
      },
      include: {
        session: {
          include: {
            user: true,
          },
        },
      },
    })
    const session = channelSessions.map(cs => ({
      id: cs.sessionId,
      user: JSON.parse(cs.session.user.json),
    }))
    return session
  },
}

export default channelService
