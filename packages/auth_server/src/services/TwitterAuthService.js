import Twitter from 'twitter-lite'
import { BadRequestError } from '../utils/errors'
import { utils } from 'ethers'
import logger from '../utils/logger'
import configs from '../../../../configs'
import twitterHandleService from './TwitterHandleService'
const config = configs.get('auth')

class TwitterAuthService {  
  constructor () {
    this.app = null
    this._initTwitterClient()
  }

  async _initTwitterClient () {
    this.initiatingClient = true
    try {
      const user = new Twitter({
        consumer_key: config.CONSUMER_KEY,
        consumer_secret: config.CONSUMER_SECRET
      })
      
      const response = await user.getBearerToken()
      
      this.app = new Twitter({
        bearer_token: response.access_token
      })

      logger.debug("Twitter client inited")
      
      this.initiatingClient = false
      return true
    } catch (err) {
      logger.error('Error while initiating Twitter client!')
      const errText = err.errors && err.errors[0]
      logger.error(errText)
      this.initiatingClient = false
      return false
    }
  }

  async getUsersObjects (userIds) {
    const result = await this.app.post('users/lookup', {
      user_id: userIds
    })
    return result
  }
  
  async getFollowers (userId, cursor) {
    const result = await this.app.get('followers/ids', {
      user_id: userId,
      stringify_ids: true,
      cursor
    })
    return result
  }
  
  async _getTweet (tweetID) {
    if (this.initatingClient) {
      logger.warn("Connecting to Tiwtter client...abpruting request")
      throw new BadRequestError('Twitter connection error. Try again later')
    }
    
    if (!this.app) {
      const clientInited = await this._initTwitterClient()
      if (!clientInited) {
        throw new BadRequestError('Twitter connection error.')
      }
    }
    
    try {
      logger.debug(`Getting tweetId ${tweetID} via Twitter API call`)
      
      const result = await this.app.get('statuses/show', {
        id: tweetID,
        tweet_mode: 'extended'
      })
      return result
    } catch (err) {
      logger.error('Error while fetching tweet')
      logger.json(err)
      const errObj = err.errors && err.errors[0] || {}
      let errText = "Too many requests at the moment. Please try again in 30 minutes or DM @linkdropHQ on Twitter."
      if (errObj.code === 179) {
        errText = "Can't retrieve the tweet content due to user privacy settings. Please update privacy settings to verify Twitter account."
      }
      throw new BadRequestError(errText)
    }
  }

  _checkTweetText (handle, tweetUsername, tweetText, address) {
    // check that tweet was made by the correct handle
    if (handle.toLowerCase() !== tweetUsername.toLowerCase()) {
      logger.warn(`Twitter Handle does not match tweet id: ${handle} != ${tweetUsername}`)
      throw new BadRequestError('Twitter Handle does not match tweet id. To resolve the issue please DM @linkdropHQ on Twitter.')
    }

    // check that tweet was made by the correct handle
    const message = address + config.TWEET_ADDRESS_SALT
    const messageBytes = utils.toUtf8Bytes(message)
    const sig = utils.keccak256(messageBytes).substring(2, 8)
    
    if (tweetText.indexOf(sig) === -1) {
	logger.warn(`Tweet text does not contain twitter address: ${sig} not in ${tweetText}`)
	throw new BadRequestError(`Tweet should contain correct signature: ${sig}`)
    }

    
    const hashtag = config.TWEET_HASHTAG
    if (tweetText.indexOf(hashtag) === -1) {
	logger.warn(`Tweet text does not contain twitter hashtag: ${hashtag} not in ${tweetText}`)
	throw new BadRequestError(`Tweet should contain correct hashtag: ${hashtag}`)
    }

  }
  
  async checkTweet (tweetID, tweetAddress, handleDb) {
    logger.debug('checking tweetID: ' + tweetID)

    // if already fetched tweet
    if (handleDb.tweet && handleDb.tweet.id === tweetID) {
      this._checkTweetText(handleDb.handle, handleDb.handle, handleDb.tweet.text, tweetAddress)
      return true
    }
    
    const tweet = await this._getTweet(tweetID)
    // logger.debug({ tweet })
    this._checkTweetText(handleDb.handle, tweet.user.screen_name, tweet.full_text, tweetAddress)

    // save in db and cache that tweet was checked
    twitterHandleService.updateTweet({ handle: handleDb.handle, tweetId: tweetID, tweetText: tweet.full_text })

  }
}

export default new TwitterAuthService()
