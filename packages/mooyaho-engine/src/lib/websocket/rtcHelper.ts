import actionCreators from './actions/send'
import { publishJSON } from './redis/createRedisClient'
import prefixer from './redis/prefixer'

const rtcHelper = {
  call({ from, to }: { from: string; to: string }) {
    publishJSON(prefixer.direct(to), actionCreators.called(from))
  },
  answer({ from, to }: { from: string; to: string }) {
    publishJSON(prefixer.direct(to), actionCreators.answered(from))
  },
  candidate({ from, to }: { from: string; to: string }) {
    publishJSON(prefixer.direct(to), actionCreators.candidated(from))
  },
}

export default rtcHelper
