/**
 * actions that server sends
 */

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

export type SendAction = ConnectedAction | ReuseIdSuccessAction

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
}

export default actionCreators
