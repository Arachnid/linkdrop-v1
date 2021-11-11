/* global gtag */
import { put, select, call } from 'redux-saga/effects'
import { ERRORS } from './data'
import {
  claim
} from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    const { wallet, chainId } = payload
    yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [] } })
    
    const { success, txHash, errors, error, tokenId } = yield call(claim, { address: wallet })
    if (success) {
      gtag('event', 'token_claimed', {
        'event_label': 'token claimed',
        'event_category': 'token_claimed'
      });
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
      yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 9 } })
    } else {
      yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [error || "Oh no! Something bad happened, please try again later"] } })
    }
    
  } catch (error) {
    console.log({ error })
  }
}

export default generator

generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
