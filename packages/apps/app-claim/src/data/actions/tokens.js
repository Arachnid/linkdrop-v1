class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  checkTransactionStatus ({ transactionId, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress, campaignId } })
  }

  checkToken ({ wallet, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TOKEN', payload: { wallet, chainId } })
  }

  claimToken ({ wallet, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKEN', payload: { wallet, chainId } })
  }
}

export default Tokens
