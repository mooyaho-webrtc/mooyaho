import { FastifyPluginAsync } from 'fastify'
import channelService from '../../services/channelService'
import CreateChannelBodySchema from '../../schemas/channels/create/body.json'
import { CreateChannelBody } from '../../schema-types/channels/create/body'

const channels: FastifyPluginAsync = async fastify => {
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
}
export default channels
