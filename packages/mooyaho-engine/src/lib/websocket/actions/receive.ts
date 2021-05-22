/**
 * actions that server receives
 */

type GetIdAction = {
  type: 'getId'
}

type ReuseIdAction = {
  type: 'reuseId'
  id: string
  token: string
}

type SubscribeAction = {
  type: 'subscribe'
  key: string
}

type UnsubscribeAction = {
  type: 'unsubscribe'
  key: string
}

type EnterAction = {
  type: 'enter'
  channel: string
}

type LeaveAction = {
  type: 'leave'
}

export type Message =
  | {
      type: 'text'
      text: string
    }
  | {
      type: 'mute'
      value: boolean
    }
  | {
      type: 'custom'
      data: any
    }

type MessageAction = {
  type: 'message'
  message: Message
}

const actionTypes = [
  'getId',
  'reuseId',
  'subscribe',
  'unsubscribe',
  'enter',
  'leave',
  'message',
]

export type ReceiveAction =
  | GetIdAction
  | ReuseIdAction
  | SubscribeAction
  | UnsubscribeAction
  | EnterAction
  | LeaveAction
  | MessageAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
