const ethers = require('ethers')

// Should be signed by linkdrop master (sender)
export const signLinkForERC1155 = async (
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
      tokenAmount,
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
export const createLinkForERC1155 = async (
  linkdropSigner, // Wallet
  ethAmount,
  tokenAddress,
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
  const linkdropSignerSignature = await signLinkForERC1155(
    linkdropSigner,
    ethAmount,
    tokenAddress,
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
