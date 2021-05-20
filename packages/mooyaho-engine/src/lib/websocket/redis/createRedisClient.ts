import redis from 'redis'

const createRedisClient = () => {
  return redis.createClient()
}

const coreRedisClient = createRedisClient()
