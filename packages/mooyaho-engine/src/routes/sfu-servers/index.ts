import { FastifyPluginAsync } from 'fastify'
import protect from '../../lib/plugins/protect'
import { CreateSFUServerBody } from '../../schema-types/sfu-servers/create/body'
import CreateSFUServerBodySchema from '../../schemas/sfu-servers/create/body.json'
import sfuServerService from '../../services/sfuServerService'

const sfuServers: FastifyPluginAsync = async fastify => {
  fastify.register(protect)

  fastify.get('/', async () => {
    return sfuServerService.list()
  })

  fastify.post<{
    Body: CreateSFUServerBody
  }>(
    '/',
    {
      schema: {
        body: CreateSFUServerBodySchema,
      },
    },
    async request => {
      return sfuServerService.create(request.body.address)
    }
  )

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        await sfuServerService.delete(parseInt(request.params.id, 10))
      } catch (e) {}
      reply.status(204)
    }
  )

  fastify.patch<{ Params: { id: string }; Body: { disabled: boolean } }>(
    '/:id',
    async (request, reply) => {
      return sfuServerService.updateState(
        parseInt(request.params.id, 10),
        request.body.disabled
      )
    }
  )
}

export default sfuServers
