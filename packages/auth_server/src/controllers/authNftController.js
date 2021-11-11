import { BadRequestError } from '../utils/errors'
// import twitterAuthService from '../services/TwitterAuthService'
import twitterHandleService from '../services/TwitterHandleService'
import nftService from '../services/NftService'
import logger from '../utils/logger'
import { ethers } from 'ethers'
import NFTHandleMapping from '../../tasks/handles-data/nft_handle_mapping.json'

export const claim = async (req, res) => {
  logger.debug("#getLink...")

  //throw new BadRequestError('Tweet URL is not provided')
  const { address } = req.body

  if (!address) {
    throw new BadRequestError('Address is not provided')
  }

  // check that NFT id belongs to user  
  const tokenId = await nftService.getNftId(address)

  logger.json({ tokenId })
  
  const user = NFTHandleMapping[String(tokenId)]

  logger.json({ user })
  
  if (!(user && user.handle)) {
    throw new BadRequestError(`No Twitter Handle found for NFT ID ${tokenId}`)
  }

  const handle = user.handle.toLowerCase()
   
   // // check handle in mongo
  const handleDb = await twitterHandleService.findByHandle(handle)

  logger.json(handleDb)
  if (!(handleDb && handleDb.linkdropUrl)) {
    throw new BadRequestError(`Twitter user ${handle} is not approved for the drop`)
  }

  // return txHash if it was claimed before
  if (handleDb.txHash) {
    res.json({
      success: true,
      txHash: handleDb.txHash,
      tokenId: handleDb.tokenId
    })
    return null
  }

  const txHash = await twitterHandleService.claimLinkdropForHandle(handleDb, address)
  
  res.json({
    success: true,
    txHash: txHash,
    tokenId: handleDb.tokenId
  })
}
