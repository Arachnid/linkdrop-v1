class User {
  constructor (actions) {
    this.actions = actions
  }

  changeLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.CHANGE_LOCALE', payload: { locale } })
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  setLoading ({ loading }) {
    this.actions.dispatch({ type: 'USER.SET_LOADING', payload: { loading } })
  }

  setErrors ({ errors }) {
    this.actions.dispatch({ type: 'USER.SET_ERRORS', payload: { errors } })
  }

  setWalletType ({ walletType }) {
    this.actions.dispatch({ type: 'USER.SET_WALLET_TYPE', payload: { walletType } })
  }

  saveData ({ email, account }) {
    this.actions.dispatch({ type: '*USER.SEND_DATA', payload: { email, account } })
  }

  checkTweet (twitterLink, address, chainId) {
    this.actions.dispatch({ type: '*USER.CHECK_TWEET', twitterLink, address, chainId })
  }

  checkEligibility (twitterName) {
    this.actions.dispatch({ type: '*USER.CHECK_ELIGIBILITY', twitterName })
  }

  getCampaignData () {
    this.actions.dispatch({ type: '*USER.GET_CAMPAIGN_DATA' })
  }
}

export default User
