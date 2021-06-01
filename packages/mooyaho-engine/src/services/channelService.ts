import { v4 } from 'uuid'
import prisma from '../lib/prisma'

const channelService = {
  async create() {
    const id = v4()
    const channel = await prisma.channel.create({
      data: {
        id,
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

  async addUser() {
    // TODO: Implement me
  },
  async removeUser() {
    // TODO: Implement me
  },
  async listUsers() {
    // TODO: Implement me
  },
}

export default channelService
