import { put } from 'redux-saga/effects'

const generator = function * () {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: null } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: null } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol: null } })
    yield put({ type: 'TOKENS.SET_ERC1155_SINGLE_ASSET', payload: { asset: null } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
