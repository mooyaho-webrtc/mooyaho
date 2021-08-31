import { FastifyPluginAsync } from 'fastify'
import channelService from '../../services/channelService'
import CreateChannelBodySchema from '../../schemas/channels/create/body.json'
import { CreateChannelBody } from '../../schema-types/channels/create/body'
import RemoveChannelParamsSchema from '../../schemas/channels/remove/params.json'
import { RemoveChannelParams } from '../../schema-types/channels/remove/params'
import GetChannelParamsSchema from '../../schemas/channels/get/params.json'
import { GetChannelParams } from '../../schema-types/channels/get/params'
import BulkDeleteBodySchema from '../../schemas/channels/get/params.json'
import { BulkDeleteChannelBody } from '../../schema-types/channels/bulk-delete/body'
import protect from '../../lib/plugins/protect'

const channels: FastifyPluginAsync = async fastify => {
  fastify.register(protect)

  // @todo: list all channels
  fastify.get(
    '/',
    {
      schema: {
        description: 'List all channels',
        response: {
          200: {
            description: 'Successful response',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                sfuServerId: { type: 'number', nullable: true },
                sessionCount: { type: 'number' },
              },
            },
            example: [
              {
                id: '94ea89b2-c2e1-4e99-817c-47c62dfa7297',
                sfuServerId: 1,
                sessionCount: 0,
              },
            ],
          },
        },
      },
    },
    async () => {
      const channels = await channelService.listAll()
      return channels
    }
  )
  // add option to list empty ones

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

  fastify.post<{ Body: BulkDeleteChannelBody }>(
    '/bulk-delete',
    {
      schema: {
        body: BulkDeleteBodySchema,
        response: {
          204: {
            description: 'Successful response',
            type: 'null',
            example: null,
          },
        },
      },
    },
    async request => {
      const ids = request.body.ids
      for (let i = 0; i < ids.length; i++) {
        await channelService.remove(ids[i])
      }
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
