import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import configs from '../../../../configs'
import logger from '../utils/logger'
import { BadRequestError } from '../utils/errors'
const config = configs.get('server')
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

class ProxyFactoryService {
  constructor () {
    // initialize proxy factory
    this.contract = new ethers.Contract(
      config.FACTORY_ADDRESS,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )
  }

  checkClaimParams ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    return this.contract.checkClaimParams(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    )
  }
 
    checkGasPrice (gasPrice) {
	if (gasPrice.gt(250 * 10**9)) {
	    const gasPriceHuman = gasPrice.div(10**9).toString()
	    throw new BadRequestError(`Oops! Gas price is currently too high - ${gasPriceHuman} gwei. Please try again, when it is lower than 200 gwei. Or contact us via email hi@linkdrop.io to resolve.`)
	}
	console.log("check passed")
    }
    
  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
      const gasPrice = await relayerWalletService.getGasPrice()
      logger.json({ gasPrice })

      this.checkGasPrice(gasPrice)
      
    return this.contract.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasPrice }
    )
  }

  checkClaimParamsERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    return this.contract.checkClaimParamsERC721(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    )
  }

  checkClaimParamsERC1155 ({
    weiAmount,
    nftAddress,
    tokenId,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {

    console.log("checking erc1155...")
    console.log({
      weiAmount,
      nftAddress,
      tokenId,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    
    return this.contract.checkClaimParamsERC1155(
      weiAmount,
      nftAddress,
      tokenId,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    )
  }

  
  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    const gasPrice = await relayerWalletService.getGasPrice()

      this.checkGasPrice(gasPrice)
      
    return this.contract.claimERC721(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasPrice }
    )
  }

  async claimERC1155 ({
    weiAmount,
    nftAddress,
    tokenId,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    const gasPrice = await relayerWalletService.getGasPrice()
    console.log("claiming erc1155...")
    console.log({
      weiAmount,
      nftAddress,
      tokenId,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })
    
    return this.contract.claimERC1155(
      weiAmount,
      nftAddress,
      tokenId,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasPrice }
    )
  }
}

export default new ProxyFactoryService()
