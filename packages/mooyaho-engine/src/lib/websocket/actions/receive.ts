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

const actionTypes = ['getId', 'reuseId', 'subscribe', 'unsubscribe']

export type ReceiveAction =
  | GetIdAction
  | ReuseIdAction
  | SubscribeAction
  | UnsubscribeAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
