import { v4 } from 'uuid'
import { MooyahoError } from '../lib/MooyahoError'
import prisma from '../lib/prisma'
import channelHelper from '../lib/websocket/channelHelper'

const channelService = {
  async getChannelInfo(id: string) {
    const channel = await prisma.channel.findUnique({
      where: {
        id,
      },
      include: {
        ChannelSessions: {
          include: {
            session: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    if (!channel) {
      throw new MooyahoError({
        name: 'Not Found',
        statusCode: 404,
        message: 'Channel is not found',
      })
    }

    const channelSessions = channel.ChannelSessions.map(cs => ({
      sessionId: cs.sessionId,
      user: JSON.parse(cs.session.user.json),
    }))

    return {
      id: channel.id,
      sfuServerId: channel.sfuServerId,
      channelSessions,
    }
  },
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

  async remove(id: string) {
    channelHelper.close(id)
    return Promise.all([
      prisma.channelSession.deleteMany({
        where: {
          channelId: id,
        },
      }),
      prisma.channel.delete({
        where: {
          id,
        },
      }),
    ])
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
