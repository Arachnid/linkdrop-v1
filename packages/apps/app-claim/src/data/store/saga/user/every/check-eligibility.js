/* global gtag */

import { put, call } from 'redux-saga/effects'
import {
  checkEligibility
} from 'data/api/user'


const generator = function * ({ twitterName }) {
  try {
    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: true } })

    yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [] } })
    
    const response = yield call(checkEligibility, {
      twitterName: twitterName.toLowerCase()
    })
    gtag('event', 'eligibility_checked', {
      'event_label': 'eligibility checked',
      'event_category': 'eligibility_checked'
    });
    
    if (response.success) {
      yield put({ type: 'USER.SET_STEP', payload: { step: 12 } })
    } else {
      yield put({ type: 'USER.SET_LOCAL_ERRORS', payload: { localErrors: [response.error || `User ${twitterName} not approved for the drop`] } })
    }

    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: false } })
  } catch (e) {

    yield put({ type: 'USER.SET_TWEET_CHECK_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
