import logger from '../utils/logger'
import TwitterHandle from '../models/TwitterHandle'
import { BadRequestError } from '../utils/errors'
import linkdropService from './LinkdropService'

class HandleService {

  constructor () {
    logger.debug("Initializing Handle Service...")
    this._cache = {}
  }

  async loadCache () {
    //
    // load everything to memory for faster lookups
    const handles = await TwitterHandle.find({})
    this._cache = {}
    handles.map(handle => {
      this._cache[handle.handle] = handle
    })
    
    // console.log(handles)
    logger.json("HandleService: cache loaded. Handles: " + Object.keys(this._cache).length)    
  }


  findByHandle (handle) {
    handle = handle.toLowerCase()
    const handleCache = this._cache[handle]
    return handleCache
  }

  // check hande in DB 
  async findByHandleInDb (handle) {
    handle = handle.toLowerCase()
    const handleDb = await TwitterHandle.findOne({ handle })
    return handleDb
  }


  // create new DB record with handle
  async create ({ handle, linkdropUrl, tokenId }) {
    const handleDb = new TwitterHandle({ handle, linkdropUrl, tokenId})

    logger.debug('Saving Twitter Handle to database:')
    logger.json(handleDb)

    await handleDb.save()

    logger.debug(
      `Twitter Handle ${handle} was successfully saved to database`
    )
    return handleDb
  }

  // update handle in DB with tweetText & TweetId
  async updateTweet ({ handle, tweetId, tweetText }) {
    handle = handle.toLowerCase()
    const handleDb = await this.findByHandleInDb(handle)

    handleDb.tweet = {
      id: tweetId,
      text: tweetText
    }
    
    logger.debug('Updating existing twitter handle in database...')
    logger.json(handleDb)

    this._cache[handle] = handleDb
    
    await handleDb.save()
    
    logger.debug(
      `Twitter Handle ${handle} was successfully updated in database with tweet id: ${tweetId}`
    )
    return handleDb
  }

  // get link from Link DB and add it to hadle in handle DB
  async getLinkdropUrl (handleDb) {
    
    try { 
      logger.debug(`Fetching link to ${handleDb.handle}...`)
      const linkdropUrl = await linkdropService.popLink(handleDb.linkdropUrl)
      logger.debug(`Linkded fetched to ${handleDb.handle} - ${linkdropUrl}`)
      
      if (linkdropUrl) {
        this.updateLinkdropUrl({ handleDb, linkdropUrl })
      }
      return linkdropUrl
    } catch (err) {
      const errMsg = `Error while fetching link to user: ${handleDb.handle}`
      logger.error(errMsg)
      logger.error(`Linkdrop url: ${handleDb.linkdropUrl}`)
      logger.error(err)
      throw new BadRequestError(errMsg)
    }
  }

   // update handle in DB with Linkdrop Link
  async updateLinkdropUrl ({ handleDb, linkdropUrl }) {

    handleDb.linkdropUrl = linkdropUrl
    
    logger.debug('Updating existing twitter handle in database:')
    logger.json(handleDb)

    this._cache[handleDb.handle] = handleDb
    
    await handleDb.save()
    
    logger.debug(
      `Twitter Handle ${handleDb.handle} was successfully updated in database with linkdropUrl: ${linkdropUrl}`
    )
    return handleDb
  }

    // claim link for handle
    async claimLinkdropForHandle (handleDb, address) {

    if (!handleDb.linkdropUrl) {
      const linkdropUrl = await this.getLinkdropUrl(handleDb)
      if (!linkdropUrl) {
        logger.warn(`All links have been already claimed`)
        throw new BadRequestError ('All links have been claimed')
      }
      logger.debug("I am in claim and get link if user do not have link yet")
    }

    // check handle in mongo
    try { 
      logger.debug(`Claiming link to ${handleDb.handle}...`)
      const { txHash,
              tokenId 
            } = await linkdropService.parseAndClaimLink(handleDb.linkdropUrl, address)
      logger.debug(`Linkded claimed to ${handleDb.handle} - ${txHash}` ,`with tokenId - ${tokenId}`)
      
      if (txHash && tokenId) {
        this.updateTxHash({ handleDb, txHash , tokenId})
      }
      return { txHash, tokenId }
    } catch (err) {
      const errMsg = `Error while claiming NFT for user: ${handleDb.handle}`
      logger.error(errMsg)
      logger.error(`Linkdrop url: ${handleDb.linkdropUrl}`)
      logger.error(err)
      throw new BadRequestError(errMsg)
    }
  }

 
  // update handle in DB with txHash
  async updateTxHash ({ handleDb, txHash, tokenId}) {

    handleDb.txHash = txHash
    handleDb.tokenId = tokenId
    
    logger.debug('Updating existing twitter handle in database with txHash:')
    logger.json(handleDb)

    this._cache[handleDb.handle] = handleDb
    
    await handleDb.save()
    
    logger.debug(
      `Twitter Handle ${handleDb.handle} was successfully updated in database with txHash: ${txHash} and ${tokenId}`,

    )
    return handleDb
  }
}

export default new HandleService()
