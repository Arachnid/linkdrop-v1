import { put, call } from 'redux-saga/effects'
import { getERC721TokenData, getERC721AssetData } from 'data/api/tokens'
import { ethers } from 'ethers'
import ERC721Mock from '@linkdrop/contracts/build/ERC721Mock.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, ipfsGatewayUrl } from 'app.config.js'
import { removeNonAscii } from './helpers'

const getImage = function * ({ metadataURL, nftAddress, tokenId, chainId }) {
  try {
    if (Number(chainId) === 1 && nftAddress.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae') {
      const assetData = yield call(getERC721AssetData, { tokenAddress: nftAddress, tokenId })
      let { image_preview_url: imageUrl } = assetData
      if (imageUrl) {
        imageUrl = imageUrl.includes('ipfs://ipfs/') ? imageUrl.replace('ipfs://ipfs/', ipfsGatewayUrl) : imageUrl
        imageUrl = imageUrl.includes('ipfs://') ? imageUrl.replace('ipfs://', ipfsGatewayUrl) : imageUrl
        imageUrl = imageUrl.length === 46 && imageUrl.indexOf('/') === -1 ? `${ipfsGatewayUrl}/${imageUrl}` : imageUrl
        return imageUrl
      }
    }
    
    let { image: imageUrl } = yield call(getERC721TokenData, { erc721URL: metadataURL })
    imageUrl = imageUrl.includes('ipfs://ipfs/') ? imageUrl.replace('ipfs://ipfs/', ipfsGatewayUrl) : imageUrl
    imageUrl = imageUrl.includes('ipfs://') ? imageUrl.replace('ipfs://', ipfsGatewayUrl) : imageUrl
    imageUrl = imageUrl.length === 46 && imageUrl.indexOf('/') === -1 ? `${ipfsGatewayUrl}/${imageUrl}` : imageUrl
    return imageUrl
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getContractData = function * ({ tokenId, nftContract }) {
  try {
    return yield nftContract.tokenURI(tokenId)
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getSymbol = function * ({ nftContract, nftAddress, tokenId, chainId, metadataURL }) {
  try {
    if (Number(chainId) === 1 && nftAddress.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae') {
      const assetData = yield call(getERC721AssetData, { tokenAddress: nftAddress, tokenId })
      const { name } = assetData
      if (name) {
        return name
      }
    }

    return yield nftContract.symbol()
  } catch (err) {
    console.error(err)
    if (nftAddress === '0xfac7bea255a6990f749363002136af6556b31e04') {
      return 'ENS'
    }
    console.log('here')
    return 'ERC721'
  }
}

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId, chainId, name: linkFromName } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, ERC721Mock.abi, provider)
    const metadataURL = yield getContractData({ tokenId, nftContract })
    let actualUrl = metadataURL.includes('ipfs://ipfs/') ? metadataURL.replace('ipfs://ipfs/', ipfsGatewayUrl) : metadataURL
    actualUrl = actualUrl.includes('ipfs://') ? actualUrl.replace('ipfs://', ipfsGatewayUrl) : actualUrl
    actualUrl = actualUrl.length === 46 && actualUrl.indexOf('/') === -1 ? `${ipfsGatewayUrl}/${actualUrl}` : actualUrl

    // opensea dirty hardcode
    let name, image
    if (nftAddress.toLowerCase() === '0xeaba6b46cab0e21085b2d4355e32cb90360c4f2b') { 
      image = 'https://lh3.googleusercontent.com/fkPWX_hRy1aKkWDzAqxUVhDYpMbPLEvjBleqD49xuRPorqBAC0Hlll1U30b22S6exD9LsaqaNivdzOk4Q5GfBBBL7UN-Dhf3wI6odt4=s0'
      name = 'OhanaDAI'
    } else {
      name = yield getSymbol({ nftContract, nftAddress, tokenId, chainId, metadataURL: actualUrl })
      if (actualUrl !== '') {
        image = yield getImage({ metadataURL: removeNonAscii({ url: actualUrl }), nftAddress, tokenId, chainId })
      }
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: linkFromName || name } })

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
    const { nftAddress, chainId, name: linkFromName } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, ERC721Mock.abi, provider)
    const name = yield getSymbol({ nftContract, nftAddress })
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: linkFromName || name } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
