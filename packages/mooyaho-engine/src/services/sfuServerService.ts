import { SfuServer } from '@prisma/client'
import { create } from 'domain'
import prisma from '../lib/prisma'

const sfuServerService = {
  async list() {
    return await prisma.sfuServer.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  },

  async create(address: string) {
    const sfuServer = await prisma.sfuServer.create({
      data: {
        address,
      },
    })
    return sfuServer
  },

  async updateState(id: number, disabled: boolean) {
    const sfuServer = await prisma.sfuServer.update({
      where: {
        id,
      },
      data: {
        disabled,
      },
    })
    return sfuServer
  },

  async delete(id: number) {
    await prisma.sfuServer.delete({
      where: {
        id,
      },
    })
    return true
  },

  async findSFUServerOf(channelId: string) {
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        sfuServer: true,
      },
    })

    return channel?.sfuServer ?? null
  },
}

export default sfuServerService
