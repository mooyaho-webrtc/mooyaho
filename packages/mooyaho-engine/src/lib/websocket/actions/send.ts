/**
 * actions that server sends
 */

import { SessionUser } from '../../../services/sessionService'
import { Message } from './receive'

type ConnectedAction = {
  type: 'connected'
  id: string
  token: string
}

type GetIdSuccessAction = {
  type: 'getIdSuccess'
  id: string
}

type ReuseIdSuccessAction = {
  type: 'reuseIdSuccess'
}

type SubscriptionMessageAction = {
  type: 'subscriptionMessage'
  key: string
  message: any
}

type SubscriptionSuccess = {
  type: 'subscriptionSuccess'
  key: string
}

type ListSessionsSuccess = {
  type: 'listSessionsSuccess'
  sessions: { id: string; user: any }[]
}

type EnterSuccessAction = {
  type: 'enterSuccess'
  sfuEnabled: boolean
}

type EnteredAction = {
  type: 'entered'
  sessionId: string
  user: SessionUser
}

type LeftAction = {
  type: 'left'
  sessionId: string
}

type MessagedAction = {
  type: 'messaged'
  sessionId: string
  message: Message
}

type CalledAction = {
  type: 'called'
  from: string
  sdp: string
  isSFU?: boolean
}

type AnsweredAction = {
  type: 'answered'
  from?: string
  sdp: string
  isSFU?: boolean
}

type CandidatedAction = {
  type: 'candidated'
  from: string
  candidate: any
  isSFU?: boolean
}

type IntegratedUserAction = {
  type: 'integrated'
  user: {
    id: string
    [key: string]: any
  }
}

type ChannelClosedAction = {
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
  reuseIdSuccess: (): ReuseIdSuccessAction => ({ type: 'reuseIdSuccess' }),
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
  ): AnsweredAction => ({
    type: 'answered',
    from,
    sdp,
    isSFU,
  }),
  candidated: (
    from: string,
    candidate: any,
    isSFU?: boolean
  ): CandidatedAction => ({
    type: 'candidated',
    from,
    candidate,
    isSFU,
  }),
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
