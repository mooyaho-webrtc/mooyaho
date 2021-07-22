import { SfuServer } from '@prisma/client'
import { create } from 'domain'
import prisma from '../lib/prisma'
import {
  localSubscriber,
  publishAsync,
} from '../lib/websocket/redis/createRedisClient'

const sfuServerService = {
  async list() {
    return await prisma.sfuServer.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  },

  async listWithStats() {
    const list = await this.list()
    const stats: { sfuServerId: number; sessions: number }[] =
      await prisma.$queryRaw(`SELECT c.sfuServerId, COUNT(*) as sessions from ChannelSession cs 
      inner join Channel c on cs.channelId  = c.id
      group by c.sfuServerId 
      order by sessions asc
    `)
    // convert statsArray to Map
    const statsMap = new Map<number, number>()
    stats.forEach(({ sfuServerId, sessions }) => {
      statsMap.set(sfuServerId, sessions)
    })

    // return list with joined stats
    const listWithStats = list.map(s => ({
      ...s,
      sessions: statsMap.get(s.id) ?? 0,
    }))

    // sort listWithStats by sessions and return
    return listWithStats.sort((a, b) => a.sessions - b.sessions)
  },

  async getNextSFUServerId() {
    const listWithStats = await this.listWithStats()
    return listWithStats[0]?.id
  },

  async create(address: string) {
    const sfuServer = await prisma.sfuServer.create({
      data: {
        address,
      },
    })

    publishAsync('sfu_created', sfuServer.id.toString())
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

  async delete(id: number, force?: boolean) {
    // @todo: check if there are sessions on this sfuServer

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

  async getSFUServerById(id: number) {
    const sfuServer = await prisma.sfuServer.findUnique({
      where: {
        id,
      },
    })
    return sfuServer
  },
}

export default sfuServerService
