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

type ListSessionsAction = {
  type: 'listSessions'
}

type CallAction = {
  type: 'call'
  to: string
  // description: {
  //   sdp: string
  //   type: 'offer' | 'answer'
  // }
}

type AnswerAction = {
  type: 'answer'
  to: string
}

type CandidateAction = {
  type: 'candidate'
  to: string
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
  'listSessions',
  'call',
  'answer',
  'candidate',
]

export type ReceiveAction =
  | GetIdAction
  | ReuseIdAction
  | SubscribeAction
  | UnsubscribeAction
  | EnterAction
  | LeaveAction
  | MessageAction
  | ListSessionsAction
  | CallAction
  | AnswerAction
  | CandidateAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
