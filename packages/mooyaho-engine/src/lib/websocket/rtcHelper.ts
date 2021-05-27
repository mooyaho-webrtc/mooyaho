import { Description } from './actions/common'
import actionCreators from './actions/send'
import { publishJSON } from './redis/createRedisClient'
import prefixer from './redis/prefixer'

const rtcHelper = {
  call({
    from,
    to,
    description,
  }: {
    from: string
    to: string
    description: Description
  }) {
    publishJSON(prefixer.direct(to), actionCreators.called(from, description))
  },
  answer({
    from,
    to,
    description,
  }: {
    from: string
    to: string
    description: Description
  }) {
    publishJSON(prefixer.direct(to), actionCreators.answered(from, description))
  },
  candidate({
    from,
    to,
    candidate,
  }: {
    from: string
    to: string
    candidate: any
  }) {
    publishJSON(prefixer.direct(to), actionCreators.candidated(from, candidate))
  },
}

export default rtcHelper
