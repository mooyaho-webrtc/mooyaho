import Session from '../Session'
import { globalSubscriber } from './createRedisClient'

class Subscription {
  subscriptionMap = new Map<string, Set<Session>>()

  subscribe(key: string, session: Session) {
    const registered = this.subscriptionMap.has(key)
    if (!registered) {
      globalSubscriber.subscribe(key)
      this.subscriptionMap.set(key, new Set())
    }
    const sessionSet = this.subscriptionMap.get(key)! // guaranteed to be valid
    sessionSet.add(session)
  }

  dispatch(key: string, message: any) {}
}

const subscription = new Subscription()

globalSubscriber.on('message', (channel, message) => {
  try {
    const parsed = JSON.parse(message)
    subscription.dispatch(channel, message)
  } catch (e) {
    console.error(
      `Failed to parse message from redis subscription "${message}"`
    )
  }
})

export default subscription
