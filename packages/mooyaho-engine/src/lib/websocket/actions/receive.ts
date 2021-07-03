/**
 * actions that server receives
 */

import { Description } from './common'

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

export type CallAction =
  | {
      type: 'call'
      to: string
      sdp: string
      isSFU?: false
    }
  | {
      type: 'call'
      sdp: string
      isSFU: true
    }

export type AnswerAction = {
  type: 'answer'
  to: string
  sdp: string
  isSFU?: boolean
}

export type CandidateAction = {
  type: 'candidate'
  to: string
  candidate: any
  isSFU?: boolean
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

type IntegrateUserAction = {
  type: 'integrateUser'
  user: {
    [key: string]: any
  }
}

type SFUAnswerAction = {
  type: 'SFUAnswer'
  sessionId: string
  sdp: string
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
  'integrateUser',
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
  | IntegrateUserAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
