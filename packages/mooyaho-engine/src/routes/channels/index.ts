import { FastifyPluginAsync } from 'fastify'
import channelService from '../../services/channelService'
import CreateChannelBodySchema from '../../schemas/channels/create/body.json'
import { CreateChannelBody } from '../../schema-types/channels/create/body'
import RemoveChannelParamsSchema from '../../schemas/channels/remove/params.json'
import { RemoveChannelParams } from '../../schema-types/channels/remove/params'
import GetChannelParamsSchema from '../../schemas/channels/get/params.json'
import { GetChannelParams } from '../../schema-types/channels/get/params'

import protect from '../../lib/plugins/protect'

const channels: FastifyPluginAsync = async fastify => {
  fastify.register(protect)
  fastify.post<{ Body: CreateChannelBody }>(
    '/',
    {
      schema: {
        description: 'Create channel',
        querystring: CreateChannelBodySchema,
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              sfuServerId: {
                type: 'number',
                nullable: true,
              },
            },
            example: {
              id: 'c7fcff7d-4dd6-4e43-b4ae-18b1138a8216',
              sfuServerId: 1,
            },
          },
        },
      },
    },
    async request => {
      return channelService.create(!!request.body.sfuEnabled)
    }
  )

  fastify.get<{ Params: GetChannelParams }>(
    '/:id',
    {
      schema: {
        params: GetChannelParamsSchema,
      },
    },
    async (request, reply) => {
      return channelService.getChannelInfo(request.params.id)
    }
  )

  fastify.delete<{ Params: RemoveChannelParams }>(
    '/:id',
    {
      schema: {
        params: RemoveChannelParamsSchema,
        response: {
          204: {
            description: 'Successful response',
            type: 'null',
            example: null,
          },
        },
      },
    },
    async (request, reply) => {
      await channelService.remove(request.params.id)
      reply.status(204)
    }
  )
}
export default channels
