import { takeEvery } from 'redux-saga/effects'
import sendData from './every/send-data'
import checkTweet from './every/check-tweet'
import checkEligibility from './every/check-eligibility'
import getCampaignData from './every/get-campaign-data'

export default function * () {
  yield takeEvery('*USER.SEND_DATA', sendData)
  yield takeEvery('*USER.CHECK_TWEET', checkTweet)
  yield takeEvery('*USER.CHECK_ELIGIBILITY', checkEligibility)
  yield takeEvery('*USER.GET_CAMPAIGN_DATA', getCampaignData)
}
