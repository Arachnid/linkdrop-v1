import { BadRequestError } from '../utils/errors'
import twitterAuthService from '../services/TwitterAuthService'
// import Service from '../services/TwitterAuthService'
import twitterHandleService from '../services/TwitterHandleService'
import linkdropService from '../services/LinkdropService'
import logger from '../utils/logger'
import { ethers } from 'ethers'
const requestIp = require('request-ip')

export const claim = async (req, res) => {
  
    const ip = requestIp.getClientIp(req)
    
    const { address, fingerprint, count, device, browser, public_key, tweet_link: tweetUrl} = req.body
    logger.debug(`--DEVICE--,'CLAIM', ${fingerprint},${count},${device},${browser},${ip}`)
   

  if (!address) {
    throw new BadRequestError('Reciever address is not provided')
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
  
  // console.log({ handle, tweetId })
  
  // check twitter secret
  const handleDb = await twitterHandleService.findByHandle(handle)


  logger.json(handleDb)
  if (!handleDb) {
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
  
  // check tweet via twitter api
  // await twitterAuthService.checkTweet(tweetId, address, handleDb)

  const { txHash, 
          tokenId 
        } = await twitterHandleService.claimLinkdropForHandle(handleDb, address)

   res.json({
    success: true,
    txHash,
    tokenId
  })
}


// check if user is eligable for the drop
export const check = async (req, res) => {
  const { handle } = req.query

    logger.debug(`Checking handle: ${handle}`)
    
  if (!handle) {
    throw new BadRequestError('Twitter Handle is not provided')
  }

  const handleCache = twitterHandleService.findByHandle(handle)

 
  if (!(handleCache && handleCache.handle)) {
    res.json({
      success: false,
      handle
    })
    return null
  }

  res.json({
    success: true,
    handle
  })  
}

export const getdata = async (req, res) => {
    const ip = requestIp.getClientIp(req)    
    const linksLeft = linkdropService.getUnusedLinksCounter()
    const { public_key, fingerprint, count, device, browser } = req.body
    logger.debug(`--DEVICE--,'GET_DATA',${public_key}, ${fingerprint},${count},${device},${browser},${ip}`)

  res.json({
    success: true,
    linksLeft
  })  
}
