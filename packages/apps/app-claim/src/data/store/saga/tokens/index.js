import { takeEvery } from 'redux-saga/effects'

import checkTransactionStatus from './every/check-transaction-status'
import checkIfClaimed from './every/check-if-claimed'
import checkToken from './every/check-token'
import claimToken from './every/claim-token'

export default function * () {
  yield takeEvery('*TOKENS.CHECK_TRANSACTION_STATUS', checkTransactionStatus)
  yield takeEvery('*TOKENS.CHECK_IF_CLAIMED', checkIfClaimed)
  yield takeEvery('*TOKENS.CHECK_TOKEN', checkToken)
  yield takeEvery('*TOKENS.CLAIM_TOKEN', claimToken)
}
