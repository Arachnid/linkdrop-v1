import logger from '../utils/logger'
import Link from '../models/LinkModel'
import { BadRequestError } from '../utils/errors'
// import LinkdropSDK from '@linkdrop/sdk'
import LinkdropSDK from '../../../sdk/src'
import { ethers } from 'ethers'
import configs from '../../../../configs'
const queryString = require('query-string')

const config = configs.get('auth')

class LinkdropService {

  constructor () {
    logger.debug("Initializing Linkdrop Service...")
    this._counter = 0

    this.sdk = new LinkdropSDK({
    linkdropMasterAddress: config.LINKDROP_MASTER_ADDRESS,
    factoryAddress: config.LINKDROP_FACTORY_ADDRESS,
    chain: config.CHAIN,
    apiHost: config.LINKDROP_API_HOST,
    jsonRpcUrl: config.JSON_RPC_URL
    })
  }


  async loadCache () {
    //
    // load everything to memory for faster lookups
   this._counter = await Link.count({used: null})

   logger.debug(`"LinkdropService: Unused links loaded to cache - ${this._counter}"`)
  }


  async findByLinkInDb (link) {
    link = link.toLowerCase()
    logger.debug("Im in findByLinkInDb. Link is ", {link})
    const linkDb = await Link.findOne({ link })
    return linkDb
  }


  async create ({ linkdropUrl }) {
    const linkDb = new Link({ linkdropUrl })

    logger.debug('Saving Link to database:')
    logger.json(linkDb)

    await linkDb.save()

    logger.debug(
      `Link ${linkDb} was successfully saved to database`
    )
    return linkDb
  }


  async markAsUsed (linkDb) {

    linkDb.used = true
    
    logger.debug('Mark link as used in database...')

    this._counter -= 1 
    
    await linkDb.save()
    
    logger.debug(
      `Link ${linkDb.linkdropUrl} was successfully mark As Used`
    )
    return linkDb
  }


  async popLink () {
  	try {
     		const link = await Link.findOne({used: null })
     		if (!link) {
     			return null
     		} 
     		logger.json({link})
     		await this.markAsUsed (link)
     		return link.linkdropUrl 
       } catch (err){
          console.log("Nothing to find", err)
       throw new Error ('Error while fetching link')
      }
  }
  

  getUnusedLinksCounter () {
   return this._counter
    
  }


  async parseAndClaimLink (url, receiverAddress) {

    const urlString = url.split('?')[1]

    const linkParams = await queryString.parse(urlString)
    logger.debug("parseAndClaimLink right now, look at this: ", { linkParams })


    
    const {
      campaignId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      nftAddress,
      tokenId,
      tokenAmount,
      weiAmount
    } = linkParams


    const result = await this.sdk.claimERC1155({
      weiAmount,
      nftAddress,
      tokenAmount,
      tokenId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      receiverAddress,
      campaignId
    })



    logger.json({ result })
    if (!result.success) {
      throw new BadRequestError("Error while trying to transfer the NFT. Please try again.")
    } 
    return { txHash : result.txHash, tokenId }
  }
}

export default new LinkdropService()

