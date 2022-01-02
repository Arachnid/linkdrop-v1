class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721 ({ wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature } })
  }


  claimTokensERC1155 ({ wallet, campaignId, nftAddress, tokenId, tokenAmount, weiAmount, expirationTime, linkKey, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC1155', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, tokenAmount } })
  }


  claimTokensERC20Manual ({ campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20_MANUAL', payload: { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721Manual ({ wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721_MANUAL', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress } })
  }

  claimTokensERC1155Manual ({ wallet, campaignId, nftAddress, tokenId, tokenAmount, weiAmount, expirationTime, linkKey, linkdropSignerSignature, linkdropMasterAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC1155_MANUAL', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, linkdropMasterAddress, expirationTime, linkKey, linkdropSignerSignature, tokenAmount } })
  }

  checkTransactionStatus ({ linkKey, campaignId, type }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { linkKey, campaignId, type } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress, campaignId } })
  }
}

export default Tokens
