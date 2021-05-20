import { v4 } from 'uuid'
import WebSocket = require('ws')
import { ReceiveAction } from './actions/receive'
import actionCreators from './actions/send'
import { createHmac } from 'crypto'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  id: string
  private token: string

  constructor(private socket: WebSocket) {
    this.id = v4()
    this.token = createHmac('sha256', SESSION_SECRET_KEY!)
      .update(this.id)
      .digest('hex')

    this.informConnected()
  }

  sendJSON(data: any) {
    this.socket.send(JSON.stringify(data))
  }

  private informConnected() {
    const action = actionCreators.connected(this.id, this.token)
    this.sendJSON(action)
  }

  handle(action: ReceiveAction) {
    switch (action.type) {
      case 'getId': {
        this.handleGetId()
        break
      }
      case 'reuseId': {
        break
      }
      case 'subscribe': {
        break
      }
      case 'unsubscribe': {
        break
      }
    }
  }

  private handleGetId() {
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJSON(action)
  }
}

export default Session
