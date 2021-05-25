import { Message } from './actions/receive'
import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import { promisify } from 'util'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'

const channelHelper = {
  enter(channel: string, sessionId: string) {
    publishJSON(prefixer.channel(channel), actionCreators.entered(sessionId))
    coreRedisClient.lpush(prefixer.sessions(channel), sessionId)
  },
  leave(channel: string, sessionId: string) {
    publishJSON(prefixer.channel(channel), actionCreators.left(sessionId))
    coreRedisClient.lrem(prefixer.sessions(channel), 1, sessionId)
  },
  message(channel: string, sessionId: string, message: Message) {
    publishJSON(
      prefixer.channel(channel),
      actionCreators.messaged(sessionId, message)
    )
  },
  async listSessions(channel: string) {
    const key = prefixer.sessions(channel)
    const lrangeAsync = promisify(coreRedisClient.lrange).bind(coreRedisClient)

    return lrangeAsync(key, 0, -1)
  },
}

export default channelHelper
