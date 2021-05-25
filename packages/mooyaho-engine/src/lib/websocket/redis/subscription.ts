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

    return () => {
      this.unsubscribe(key, session)
    }
  }

  unsubscribe(key: string, session: Session) {
    const sessionSet = this.subscriptionMap.get(key)
    if (!sessionSet) return
    sessionSet.delete(session)

    if (sessionSet.size === 0) {
      this.subscriptionMap.delete(key)
    }
  }

  dispatch(key: string, message: any) {
    const sessionSet = this.subscriptionMap.get(key)
    if (!sessionSet) return
    sessionSet.forEach(value => {
      value.sendSubscriptionMessage(key, message)
    })
  }
}

const subscription = new Subscription()

globalSubscriber.on('message', (channel, message) => {
  try {
    const parsed = JSON.parse(message)
    subscription.dispatch(channel, parsed)
  } catch (e) {
    console.error(
      `Failed to parse message from redis subscription "${message}"`
    )
  }
})

export default subscription
