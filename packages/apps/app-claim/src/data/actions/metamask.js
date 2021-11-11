class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  setChain ({
    chainIdToSet,
    currentChainId,
    connector
  }) {
    this.actions.dispatch({
      type: '*METAMASK.SET_CHAIN',
      payload: {
        chainIdToSet,
        currentChainId,
        connector
      }
    })
  }
}

export default Metamask
