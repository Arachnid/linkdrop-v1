/* global gtag */

import { put, call, select } from 'redux-saga/effects'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {
  getCampaignData
} from 'data/api/user'

import { defineDeviceData, getCount } from 'helpers'


import { ethers } from 'ethers'

const ls = window.localStorage

const generator = function * ({ payload }) {
  try {
    const fp = yield FingerprintJS.load()
    const result = yield fp.get()
    const visitorId = result.visitorId //fingerprint


    const { browser, device } = defineDeviceData()

    const count = getCount()

    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })

    let privateKey = yield select(generator.selectors.privateKey)
    let publicKey = yield select(generator.selectors.publicKey)


    if (!privateKey || !publicKey) {
      const wallet = ethers.Wallet.createRandom();
      yield put({ type: 'USER.SET_PUBLIC_KEY', payload: { publicKey: wallet.address } })
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey: wallet.privateKey } })
      privateKey = wallet.privateKey
      publicKey = wallet.address
      ls && ls.setItem('privateKey', wallet.privateKey)
      ls && ls.setItem('publicKey', wallet.address)
    }


    

    const {
      success,
      linksLeft
    } = yield call(getCampaignData, {
      count,
      fingerprint: visitorId,
      public_key: publicKey,
      browser,
      device
    })

    gtag('event', 'initial_data_sent', {
      'event_label': 'initial data sent',
      'event_category': 'initial_data_sent'
    })


    if (linksLeft <= 0) {
      yield put({ type: 'USER.SET_STEP', payload: { step: 15 } })
    } else {
      yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
    }
    
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ["SERVER_ERROR_OCCURED"] } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
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
