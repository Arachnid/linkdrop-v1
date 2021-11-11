import { put, call } from 'redux-saga/effects'
import { getERC1155AssetData } from 'data/api/tokens'
import { ethers } from 'ethers'
import ERC1155Mock from '@linkdrop/contracts/build/ERC1155Mock.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, ipfsGatewayUrl } from 'app.config.js'

const getContractData = function * ({ tokenId, nftContract }) {
  try {
    // return yield nftContract.tokenURI(tokenId)
    return yield nftContract.uri(tokenId)
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getNameAndImageForERC1155 = function * ({ metadataURL, tokenId }) {
  try {
    let actualUrl = metadataURL.includes('ipfs://ipfs/') ? metadataURL.replace('ipfs://ipfs/', ipfsGatewayUrl) : metadataURL
    actualUrl = actualUrl.includes('ipfs://') ? actualUrl.replace('ipfs://', ipfsGatewayUrl) : actualUrl
    actualUrl = actualUrl.length === 46 && actualUrl.indexOf('/') === -1 ? `${ipfsGatewayUrl}/${actualUrl}` : actualUrl

    const assetData = yield call(getERC1155AssetData, { metadataURL: actualUrl, tokenId })
    let { name, image } = assetData
    if (!name) {
      name = "ERC1155"
    }

    if (!image) { image = "" }
    let actualImage = image.includes('ipfs://ipfs/') ? image.replace('ipfs://ipfs/', ipfsGatewayUrl) : image
    actualImage = actualImage.includes('ipfs://') ? actualImage.replace('ipfs://', ipfsGatewayUrl) : actualImage
    actualImage = actualImage.length === 46 && actualImage.indexOf('/') === -1 ? `${ipfsGatewayUrl}/${actualImage}` : actualImage
    return {
      name,
      image: actualImage
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
      nftAddress,
      tokenId,
      chainId,
      name: linkFromName,
      masterAddress
    } = payload

    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, ERC1155Mock.abi, provider)
    const metadataURL = yield getContractData({ tokenId, nftContract })

    // opensea dirty hardcode
    let name, image
    if (nftAddress.toLowerCase() === '0xeaba6b46cab0e21085b2d4355e32cb90360c4f2b') { 
      image = 'https://lh3.googleusercontent.com/fkPWX_hRy1aKkWDzAqxUVhDYpMbPLEvjBleqD49xuRPorqBAC0Hlll1U30b22S6exD9LsaqaNivdzOk4Q5GfBBBL7UN-Dhf3wI6odt4=s0'
      name = 'OhanaDAI'
    } else {  
      const res = yield getNameAndImageForERC1155({ tokenId, metadataURL })
      name = res.name
      image = res.image
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: linkFromName || name } })

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })

    const balance = yield nftContract.balanceOf(masterAddress, tokenId)
    if (Number(balance) <= 0) {
      return yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['ALL_NFTS_HAVE_BEEN_CLAIMED'] } })
    }

    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error({e})
    const { nftAddress, chainId, name: linkFromName } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, ERC1155Mock.abi, provider)
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: 'ERC1155' } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: '' } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
