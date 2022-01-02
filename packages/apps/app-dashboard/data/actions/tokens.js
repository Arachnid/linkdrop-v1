class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_DATA', payload: { tokenAddress, chainId } })
  }

  getTokenERC721Data ({ address }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_DATA', payload: { address } })
  }

  getAssets () {
    this.actions.dispatch({ type: '*TOKENS.GET_ASSETS'})
  }

  getEthData () {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_DATA' })
  }

  getEthBalance ({ account, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_BALANCE', payload: { account, chainId } })
  }

  getERC20Balance ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_BALANCE', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  getERC721Approved ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_APPROVED', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  getERC1155Approved ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC1155_APPROVED', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  generateERC20Link ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC20_LINK', payload: { chainId, currentAddress } })
  }

  generateERC721Link ({ tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC721_LINK', payload: { tokenId } })
  }

  generateERC1155Link ({ tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC1155_LINK', payload: { tokenId } })
  }

  generateETHLink ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ETH_LINK', payload: { chainId, currentAddress } })
  }

  setTokenERC20Data ({ tokenAddress }) {
    this.actions.dispatch({ type: '*TOKENS.SET_ERC20_DATA', payload: { tokenAddress } })
  }

  setTokenERC721Data ({ address }) {
    this.actions.dispatch({ type: '*TOKENS.SET_ERC721_DATA', payload: { address } })
  }

  getERC721SingleAsset ({ address }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_SINGLE_ASSET', payload: { tokenAddress: address } })
  }

  getERC721SingleAssetToken ({ tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_SINGLE_ASSET_TOKEN', payload: { tokenId } })
  }

  getERC721AssetTokensWithRange ({ range }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_ASSET_TOKENS_WITH_RANGE', payload: { range } })
  }

  getERC1155SingleAsset ({ address }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC1155_SINGLE_ASSET', payload: { tokenAddress: address } })
  }

  getERC1155SingleAssetToken ({ tokenId, linksAmount, callback }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC1155_SINGLE_ASSET_TOKEN', payload: { tokenId, linksAmount, callback } })
  }

  emptyTokenERC20Data () {
    this.actions.dispatch({ type: '*TOKENS.EMPTY_ERC20_DATA' })
  }

  emptyTokenERC721Data () {
    this.actions.dispatch({ type: '*TOKENS.EMPTY_ERC721_DATA' })
  }

  emptyTokenERC1155Data () {
    this.actions.dispatch({ type: '*TOKENS.EMPTY_ERC1155_DATA' })
  }
}

export default Tokens
