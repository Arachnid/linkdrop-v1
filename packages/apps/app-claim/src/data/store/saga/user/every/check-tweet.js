/* global gtag */

import { put, call, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  checkTweet
} from 'data/api/user'
import { contractAddress } from 'app.config.js'
import getToken1155Data from 'data/store/saga/contract/every/get-token1155-data'
import { defineDeviceData, getCount } from 'helpers'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const generator = function * ({ twitterLink, address, chainId }) {
  try {
    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [] } })

    const fp = yield FingerprintJS.load()
    const result = yield fp.get()
    const visitorId = result.visitorId //fingerprint


    const { browser, device } = defineDeviceData()

    const count = getCount()

    const privateKey = yield select(generator.selectors.privateKey)
    const publicKey = yield select(generator.selectors.publicKey)



    const response = yield call(checkTweet, {
      address,
      twitterLink,
      browser,
      device,
      fingerprint: visitorId,
      public_key: publicKey,
      private_key: privateKey,
      count
    })
    gtag('event', 'tweet_checked', {
      'event_label': 'Tweet checked',
      'event_category': 'tweet_checked'
    });


    
    if (!response.success) {
      yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [response.error || "Oops! Something wrong happened! Please contact @LinkdropHQ on Twitter to resovle"] } })
    }

    if (response.txHash) {
      const { name, image } = yield getToken1155Data({
        payload: {
          contractAddress,
          tokenId: response.tokenId,
          chainId
        }
      })
      console.log({ name, image })
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
      yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
      yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: response.tokenId } })
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: response.txHash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 9 } })
    }

    
    

    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: false } })
  } catch (e) {

    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  address: ({
    user: {
      address
    }
  }) => address,
  privateKey: ({
    user: {
      privateKey
    }
  }) => privateKey,
  publicKey: ({
    user: {
      publicKey
    }
  }) => publicKey,
}
