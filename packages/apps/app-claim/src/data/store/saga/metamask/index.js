import { takeEvery } from 'redux-saga/effects'

import setChain from './set-chain'

export default function * () {
  yield takeEvery('*METAMASK.SET_CHAIN', setChain)
}
