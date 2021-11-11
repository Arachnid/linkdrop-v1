import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { infuraPk } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { transactionId, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const receipt = yield provider.getTransactionReceipt(transactionId)
    if (receipt && Number(receipt.status) === 0) {
      return yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'failed' } })
    }
    if (receipt && receipt.confirmations != null && receipt.confirmations > 0) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'claimed' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
