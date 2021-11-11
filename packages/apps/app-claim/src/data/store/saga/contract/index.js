import { takeEvery } from 'redux-saga/effects'

import getPastEvents from './every/get-past-events'
import subscribeToClaimEvent from './every/subscribe-to-claim-event'
import getToken1155Data from './every/get-token1155-data'

export default function * () {
  yield takeEvery('*CONTRACT.GET_PAST_EVENTS', getPastEvents)
  yield takeEvery('*CONTRACT.SUBSCRIBE_TO_CLAIM_EVENT', subscribeToClaimEvent)
  yield takeEvery('*CONTRACT.GET_TOKEN1155_DATA', getToken1155Data)
}
