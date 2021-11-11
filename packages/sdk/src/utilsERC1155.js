const ethers = require('ethers')

// Should be signed by linkdrop master (sender)
export const signLinkERC1155 = async (
  linkdropSigner, // Wallet
  ethAmount,
  tokenAddress,
  tokenId,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  linkId,
  proxyAddress
) => {  
  const messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'address', 'address'],
    [
      ethAmount,
      tokenAddress,
      tokenId,
      Number(tokenAmount),
      expirationTime,
      version,
      chainId,
      linkId,
      proxyAddress
    ]
  )

  const messageHashToSign = ethers.utils.arrayify(messageHash)
  const signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
}

// Generates new link
export const createLinkERC1155 = async (linkdropSigner,
    weiAmount,
    nftAddress,
    tokenId,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    proxyAddress
) => {
  const linkWallet = ethers.Wallet.createRandom()
  const linkKey = linkWallet.privateKey
  const linkId = linkWallet.address
  const linkdropSignerSignature = await signLinkERC1155(
    linkdropSigner,
    weiAmount,
    nftAddress,
    tokenId,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkId,
    proxyAddress
  )
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}
