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

  createSdk ({ linkdropMasterAddress, chainId, linkKey, campaignId, provider }) {
    this.actions.dispatch({ type: '*USER.CREATE_SDK', payload: { linkdropMasterAddress, chainId, linkKey, campaignId, provider } })
  }

  saveData ({ email, account }) {
    this.actions.dispatch({ type: '*USER.SEND_DATA', payload: { email, account } })
  }

  setProvider ({ provider }) {
    this.actions.dispatch({ type: 'USER.SET_PROVIDER', payload: { provider } })
  }
}

export default User
