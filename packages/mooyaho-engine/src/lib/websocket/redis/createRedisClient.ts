import redis from 'redis'
import { promisify } from 'util'

const createRedisClient = () => {
  return redis.createClient()
}

export const coreRedisClient = createRedisClient()

// this subscriber is used for sessions
export const globalSubscriber = createRedisClient()

export const localSubscriber = createRedisClient()

export const publishAsync = promisify(coreRedisClient.publish).bind(
  coreRedisClient
)
export const publishJSON = (channel: string, json: any) =>
  publishAsync(channel, JSON.stringify(json))
