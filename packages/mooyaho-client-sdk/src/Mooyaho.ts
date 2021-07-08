import EventEmitter from 'eventemitter3'
import { EventMap, EventType } from './Events'

const events = new EventEmitter()
function emit<K extends EventType>(type: K, event: EventMap[K]) {
  events.emit(type, event)
}

class Mooyaho {
  constructor(private config: MooyahoConfig) {}

  addEventListener<K extends EventType>(
    type: K,
    listener: (event: EventMap[K]) => void
  ) {
    events.addListener(type, listener)
  }

  removeEventListener<K extends EventType>(
    type: K,
    listener: (event: EventMap[K]) => void
  ) {
    events.removeListener(type, listener)
  }

  connect() {
    emit('connected', {
      sessionId: '23245',
    })
  }
}

const mooyaho = new Mooyaho({ url: '' })

export interface MooyahoConfig {
  url: string
}

export default Mooyaho

const el = document.createElement('button')

el.addEventListener('click', e => {})
