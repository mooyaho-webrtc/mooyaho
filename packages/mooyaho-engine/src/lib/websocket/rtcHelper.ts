import { Description } from './actions/common'
import actionCreators from './actions/send'
import { publishJSON } from './redis/createRedisClient'
import prefixer from './redis/prefixer'

const rtcHelper = {
  call({ from, to, sdp }: { from: string; to: string; sdp: string }) {
    publishJSON(prefixer.direct(to), actionCreators.called(from, sdp))
  },
  answer({ from, to, sdp }: { from: string; to: string; sdp: string }) {
    publishJSON(prefixer.direct(to), actionCreators.answered(from, sdp))
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
