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

const actionTypes = ['getId', 'reuseId']

export type ReceiveAction = GetIdAction | ReuseIdAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
