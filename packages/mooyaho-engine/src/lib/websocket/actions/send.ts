/**
 * actions that server sends
 */

import { SessionUser } from '../../../services/sessionService'
import { Message } from './receive'

export type ConnectedAction = {
  type: 'connected'
  id: string
  token: string
}

export type GetIdSuccessAction = {
  type: 'getIdSuccess'
  id: string
}

export type ReuseIdSuccessAction = {
  type: 'reuseIdSuccess'
  user: any
}

export type SubscriptionMessageAction = {
  type: 'subscriptionMessage'
  key: string
  message: any
}

export type SubscriptionSuccess = {
  type: 'subscriptionSuccess'
  key: string
}

export type ListSessionsSuccess = {
  type: 'listSessionsSuccess'
  sessions: { id: string; user: any }[]
}

export type EnterSuccessAction = {
  type: 'enterSuccess'
  sfuEnabled: boolean
}

export type EnteredAction = {
  type: 'entered'
  sessionId: string
  user: SessionUser
}

export type LeftAction = {
  type: 'left'
  sessionId: string
}

export type MessagedAction = {
  type: 'messaged'
  sessionId: string
  message: Message
}

export type CalledAction = {
  type: 'called'
  from: string
  sdp: string
  isSFU?: boolean
}

export type AnsweredAction =
  | {
      type: 'answered'
      isSFU: false
      from: string
      sdp: string
    }
  | {
      type: 'answered'
      isSFU: true
      sdp: string
    }

export type CandidatedAction =
  | {
      type: 'candidated'
      from: string
      candidate: any
      isSFU: false
    }
  | {
      type: 'candidated'
      from?: string
      candidate: any
      isSFU: true
    }

export type IntegratedUserAction = {
  type: 'integrated'
  user: {
    id: string
    [key: string]: any
  }
}

export type ChannelClosedAction = {
  type: 'channelClosed'
}

export type SendAction =
  | ConnectedAction
  | ReuseIdSuccessAction
  | SubscriptionMessageAction
  | SubscriptionSuccess
  | ListSessionsSuccess
  | EnteredAction
  | LeftAction
  | MessagedAction
  | CalledAction
  | AnsweredAction
  | CandidatedAction
  | IntegratedUserAction
  | EnterSuccessAction
  | ChannelClosedAction

const actionCreators = {
  connected: (id: string, token: string): ConnectedAction => ({
    type: 'connected',
    id,
    token,
  }),
  getIdSuccess: (id: string): GetIdSuccessAction => ({
    type: 'getIdSuccess',
    id: id,
  }),
  reuseIdSuccess: (user: any): ReuseIdSuccessAction => ({
    type: 'reuseIdSuccess',
    user,
  }),
  subscriptionMessage: (
    key: string,
    message: any
  ): SubscriptionMessageAction => ({
    type: 'subscriptionMessage',
    key,
    message,
  }),
  subscriptionSuccess: (key: string): SubscriptionSuccess => ({
    type: 'subscriptionSuccess',
    key,
  }),
  listSessionsSuccess: (
    sessions: { id: string; user: any }[]
  ): ListSessionsSuccess => ({
    type: 'listSessionsSuccess',
    sessions,
  }),
  entered: (sessionId: string, user: SessionUser): EnteredAction => ({
    type: 'entered',
    sessionId,
    user,
  }),
  left: (sessionId: string): LeftAction => ({
    type: 'left',
    sessionId,
  }),
  messaged: (sessionId: string, message: Message): MessagedAction => ({
    type: 'messaged',
    message,
    sessionId,
  }),
  called: (from: string, sdp: string, isSFU?: boolean): CalledAction => ({
    type: 'called',
    from,
    sdp,
    isSFU,
  }),
  answered: (
    from: string | undefined,
    sdp: string,
    isSFU?: boolean
  ): AnsweredAction => {
    if (isSFU) {
      return {
        type: 'answered',
        isSFU,
        sdp,
      }
    }
    return {
      type: 'answered',
      isSFU: false,
      from: from!,
      sdp,
    }
  },
  candidated: (
    from: string | undefined,
    candidate: any,
    isSFU: boolean = false
  ): CandidatedAction => {
    return isSFU
      ? { type: 'candidated', from: from, candidate, isSFU: true }
      : { type: 'candidated', from: from!, candidate, isSFU: false }
  },
  integrated: (user: {
    id: string
    [key: string]: any
  }): IntegratedUserAction => ({
    type: 'integrated',
    user,
  }),
  enterSuccess: (sfuEnabled: boolean): EnterSuccessAction => ({
    type: 'enterSuccess',
    sfuEnabled,
  }),
  channelClosed: (): ChannelClosedAction => ({
    type: 'channelClosed',
  }),
}

export default actionCreators
