import { BadRequestError } from '../utils/errors'
import logger from '../utils/logger'
import configs from '../../../../configs'
const axios = require('axios');
const config = configs.get('auth')


class NftService {  
  constructor () {
    this._cache = {}
  }

  async _fetchNftId (address) {
    try {
      const response = await axios.get(config.MATIC_API_NFT_ADDRESS_URL, {
        params: {
          address,
          contract: config.AUTH_NFT_ADDRESS
        }
      })
      // console.log(response)
      // logger.json({ data: response.data })
      
      return response.data.data
    } catch (error) {
      const errMsg = `ERROR while fetching NFT ID for the address ${address}`
      logger.warn(errMsg)
      logger.warn(error)
      throw new BadRequestError(errMsg)
    }
  }
  
  
  async getNftId (address) {
    const data = await this._fetchNftId(address)
    
    if (!(data && data.tokens.length > 0)) {
      const errMsg = `50k NFT was not found for the address ${address}`
      throw new BadRequestError(errMsg)
    }

    const tokenId = data.tokens[0].id
    logger.debug(`Found NFT ID: ${tokenId} for address ${address}`)
    return tokenId
  }
}

export default new NftService()
