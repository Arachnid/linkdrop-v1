import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'

const generator = function * ({ payload }) {
  try {
    const { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const { success, txHash, errors, message } = yield sdk.claimERC721({
      weiAmount: weiAmount || '0',
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      receiverAddress: wallet,
      campaignId
    })

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 4 } })
    } else {
      if (errors.length > 0) {
        const currentError = ERRORS.indexOf(errors[0])
        yield put({ type: 'USER.SET_ERRORS', payload: { errors: [message || (currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED')] } })
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    const { response: { data: { errors = [], message } = {} } = {} } = error
    if (errors.length > 0) {
      const currentError = ERRORS.indexOf(errors[0])
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [message || (currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED')] } })
    }
  }
}

export default generator

generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
