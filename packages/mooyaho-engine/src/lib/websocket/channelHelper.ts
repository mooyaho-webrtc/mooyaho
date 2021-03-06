import { Message } from './actions/receive'
import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import { promisify } from 'util'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'
import { SessionUser } from '../../services/sessionService'
import channelService from '../../services/channelService'

const channelHelper = {
  enter(channel: string, sessionId: string, user: SessionUser) {
    publishJSON(
      prefixer.channel(channel),
      actionCreators.entered(sessionId, user)
    )
    channelService.addUser(channel, sessionId)
  },
  async leave(channel: string, sessionId: string) {
    await publishJSON(prefixer.channel(channel), actionCreators.left(sessionId))
    await channelService.removeUser(sessionId)
  },
  message(channel: string, sessionId: string, message: Message) {
    publishJSON(
      prefixer.channel(channel),
      actionCreators.messaged(sessionId, message)
    )
  },
  close(channel: string) {
    publishJSON(prefixer.channel(channel), actionCreators.channelClosed())
  },
  broadcast(channel: string, message: any) {
    publishJSON(prefixer.channel(channel), message)
  },
}

export default channelHelper
