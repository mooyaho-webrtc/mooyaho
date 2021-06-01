import { FastifyPluginAsync } from 'fastify'
import channelService from '../../services/channelService'

const channels: FastifyPluginAsync = async fastify => {
  fastify.post(
    '/',
    {
      schema: {
        description: 'Create channel',
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
            },
            example: {
              id: 'c7fcff7d-4dd6-4e43-b4ae-18b1138a8216',
            },
          },
        },
      },
    },
    async () => {
      return channelService.create()
    }
  )
}
export default channels
