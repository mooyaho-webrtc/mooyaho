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

export type CandidateAction =
  | {
      type: 'candidate'
      isSFU: false
      to: string
      candidate: any
    }
  | {
      type: 'candidate'
      isSFU: true
      candidate: any
      to?: string
    }

export type Message =
  | {
      type: 'text'
      text: string
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

export type UpdateMediaStateAction = {
  type: 'updateMediaState'
  key: 'videoOff' | 'muted'
  value: boolean
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
  'updateMediaState',
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
  | UpdateMediaStateAction

export function isReceiveAction(object: any): object is ReceiveAction {
  if (!object?.type) return false
  return actionTypes.includes(object.type)
}
