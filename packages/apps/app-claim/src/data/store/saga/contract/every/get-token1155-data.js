import { put, call } from 'redux-saga/effects'
import { getERC1155AssetData } from 'data/api/tokens'
import { ethers } from 'ethers'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, ipfsGatewayUrl } from 'app.config.js'
import ERC1155Mock from 'data/abi/ERC1155Mock.json'

const getContractData = function * ({ tokenId, nftContract }) {
  try {
    const uri = yield nftContract.uri(tokenId)
    return uri
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getNameAndImageForERC1155 = function * ({ metadataURL, tokenId }) {
  try {
    let actualUrl = metadataURL.includes('ipfs://') ? metadataURL.replace('ipfs://', ipfsGatewayUrl) : metadataURL
    
    const assetData = yield call(getERC1155AssetData, { metadataURL: actualUrl, tokenId })
    let { name, image } = assetData
    if (!name) { name = "ERC1155" }
    if (!image) { image = "" }
    return {
      name,
      image: image.includes('ipfs://') ? image.replace('ipfs://', ipfsGatewayUrl) : image
    }
  } catch (e) {
    console.log({ err: e })
    return { name: 'ERC1155', image: "" }
  }
  
}

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })

    const {
      contractAddress,
      tokenId,
      chainId
    } = payload

    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(contractAddress, ERC1155Mock.abi, provider)
    const metadataURL = yield getContractData({ tokenId, nftContract })
    const { name, image } = yield getNameAndImageForERC1155({ tokenId, metadataURL })
    return {
      name,
      image
    }
  } catch (e) {
    console.error({ e })
    return { name: 'ERC1155', image: "" }
  }
}

export default generator
