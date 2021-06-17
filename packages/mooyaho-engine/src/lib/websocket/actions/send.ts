/**
 * actions that server sends
 */

import { SessionUser } from '../../../services/sessionService'
import { Description } from './common'
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
  description: Description
}

type AnsweredAction = {
  type: 'answered'
  from: string
  description: Description
}

type CandidatedAction = {
  type: 'candidated'
  from: string
  candidate: any
}

type IntegratedUserAction = {
  type: 'integrated'
  user: {
    id: string
    [key: string]: any
  }
}

type SFUAnswerAction = {
  type: 'SFUAnswer'
  sdp: string
}

type SFUCandidatedAction = {
  type: 'SFUCandidated'
  candidate: any
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
  | SFUAnswerAction
  | EnterSuccessAction
  | SFUCandidatedAction

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
  called: (from: string, description: Description): CalledAction => ({
    type: 'called',
    from,
    description,
  }),
  answered: (from: string, description: Description): AnsweredAction => ({
    type: 'answered',
    from,
    description,
  }),
  candidated: (from: string, candidate: any): CandidatedAction => ({
    type: 'candidated',
    from,
    candidate,
  }),
  integrated: (user: {
    id: string
    [key: string]: any
  }): IntegratedUserAction => ({
    type: 'integrated',
    user,
  }),
  SFUAnswer: (sdp: string): SFUAnswerAction => ({
    type: 'SFUAnswer',
    sdp,
  }),
  enterSuccess: (sfuEnabled: boolean): EnterSuccessAction => ({
    type: 'enterSuccess',
    sfuEnabled,
  }),
  SFUCandidated: (candidate: any): SFUCandidatedAction => ({
    type: 'SFUCandidated',
    candidate,
  }),
}

export default actionCreators
