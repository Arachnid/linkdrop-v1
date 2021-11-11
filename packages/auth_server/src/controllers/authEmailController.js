import { BadRequestError } from '../utils/errors'
import twitterAuthService from '../services/TwitterAuthService'
//import Service from '../services/TwitterAuthService'
import twitterHandleService from '../services/TwitterHandleService'
import auth0Service from '../services/Auth0Service'
import logger from '../utils/logger'
import { ethers } from 'ethers'

export const claim = async (req, res) => {
  logger.debug("#getLink...")
  
  const { address, auth0_jwt } = req.body

  if (!address) {
    throw new BadRequestError('Address is not provided')
  }

  if (!auth0_jwt) {
    throw new BadRequestError('JWT is not provided')
  }
  

  const handle = await auth0Service.validateAuthToken(auth0_jwt)

  logger.json({ handle })
  
  // check twitter secret
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
    txHash,
    tokenId: handleDb.tokenId
  })
}


// check if user is eligable for the drop
export const check = async (req, res) => {
  logger.debug('Hi, email controller function')
  logger.json(req.query)
  const { email: handle } = req.query

  if (!handle) {
    throw new BadRequestError('Email is not provided')
  }

  const handleCache = twitterHandleService.findByHandle(handle)

  logger.json({ handleCache })
  
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
