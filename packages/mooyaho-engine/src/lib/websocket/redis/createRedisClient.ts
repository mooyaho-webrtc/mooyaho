import redis from 'redis'

const createRedisClient = () => {
  return redis.createClient()
}

export const coreRedisClient = createRedisClient()
export const globalSubscriber = createRedisClient()
