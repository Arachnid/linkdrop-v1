import { BadRequestError } from '../../utils/errors'
import logger from '../../utils/logger'
import proxyFactoryService from '../proxyFactoryService'
import ClaimServiceBase from './claimServiceBase'

class ClaimServiceERC1155 extends ClaimServiceBase {
  _checkClaimParams (params) {
    // check basic linkdrop params
    super._checkClaimParamsBase(params)

    // make erc721 specific checks
    if (!params.nftAddress) {
      throw new BadRequestError('Please provide nftAddress argument')
    }
    if (!params.tokenId) {
      throw new BadRequestError('Please provide tokenId argument')
    }
    if (!params.tokenAmount) {
      throw new BadRequestError('Please provide token amount argument')
    }
    
    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  async _checkParamsWithBlockchainCall (params) {
    console.log("checing params with bc call...")
    const check = await proxyFactoryService.checkClaimParamsERC1155(params)
    console.log("checked")    
    return check
  }

  async _sendClaimTx (params) {
    console.log("claiming with bc call...")    
    const tx = await proxyFactoryService.claimERC1155(params)
    console.log("claim sent erc1155")
    console.log({ tx })
    return tx
  }
}

export default new ClaimServiceERC1155()
