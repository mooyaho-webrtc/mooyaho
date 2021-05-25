import redis from 'redis'
import { promisify } from 'util'

const createRedisClient = () => {
  return redis.createClient()
}

export const coreRedisClient = createRedisClient()
export const globalSubscriber = createRedisClient()

const publishAsync = promisify(coreRedisClient.publish).bind(coreRedisClient)
export const publishJSON = (channel: string, json: any) =>
  publishAsync(channel, JSON.stringify(json))
