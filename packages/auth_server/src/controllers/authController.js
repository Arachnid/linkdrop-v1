import { BadRequestError } from '../utils/errors'
import twitterAuthService from '../services/TwitterAuthService'
import twitterHandleService from '../services/TwitterHandleService'
import logger from '../utils/logger'
import { ethers } from 'ethers'

export const claimWithTwitter = async (req, res) => {
  logger.debug("#getLink...")
  const { address: tweetAddress, privateKey: tweetPK, twitterLink: tweetUrl } = req.body

  if (!tweetPK) {
    throw new BadRequestError('Tweet secret is not provided')
  }

  if (!tweetAddress) {
    throw new BadRequestError('Tweet address is not provided')
  }

  if (!tweetUrl) {
    throw new BadRequestError('Tweet URL is not provided')
  }
  
  const parsedUrl = new URL(tweetUrl)
  if (parsedUrl.origin !== 'https://twitter.com') {
    throw new BadRequestError('Wrong Tweet URL Host provided')
  }

  const parsedUrlParts = parsedUrl.pathname.split('/')
  if (parsedUrlParts.length !== 4) {
    throw new BadRequestError('Wrong Tweet URL Path provided')
  }

  const [_n1, handle, _n2, tweetId] = parsedUrlParts

  console.log({ handle, tweetId })
  
  // check twitter secret
  const wallet = new ethers.Wallet(tweetPK)
  const tweetIdFromPk = wallet.address.substring(2, 12)

  logger.debug("reconstructed wallet address is: " + tweetIdFromPk)
  
  if (tweetIdFromPk !== tweetAddress) {
    throw new BadRequestError('Tweet secret does not match tweet id')
  }

  // check handle in mongo
  const handleDb = await twitterHandleService.findByHandle(handle)
  logger.json(handleDb)
  if (!(handleDb && handleDb.linkdropUrl)) {
    throw new BadRequestError(`Twitter user ${handle} is not approved for the drop`)
  }


  // check tweet via twitter api
  await twitterAuthService.checkTweet(tweetId, tweetAddress, handleDb)
  
  logger.debug(`Successfully given link to ${handle}.`)

  // return user in successful response
  res.json({
    success: true,
    linkdropUrl: handleDb.linkdropUrl
  })
}
