import { put, select, all } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC721Mock from 'contracts/ERC721Mock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl, defineNetworkName } from '@linkdrop/commons'
import { getERC721TokenData } from 'data/api/tokens'

const defineSymbol = function * ({ tokenContract, address }) {
  try {

    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress, chainId } = payload
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, ERC721Mock.abi, provider)
    const symbol = yield tokenContract.symbol()
    return symbol
  } catch (e) {
    return `NFT-${address.slice(0, 3)}`
  }
}

// {
//   address: "0x16baf0de678e52367adc69fd067e5edd1d33e3bf"
//   ids: ["478"]
//   images: {478: undefined}
//   names: {478: "CryptoKitty #478"}
//   symbol: "KITTYR"
// }

const generator = function * ({ payload }) {
  yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: true } })
  const { address } = payload
  const assets = yield select(generator.selectors.assets)
  const currentAsset = assets.find(item => item.address === address)
  const chainId = yield select(generator.selectors.chainId)
  const networkName = defineNetworkName({ chainId })
  const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
  const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
  const tokenContract = yield new ethers.Contract(address, ERC721Mock.abi, provider)
  // const symbol = yield defineSymbol({ tokenContract, address })
  // let metadataURL = ''
  // let image = address.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae' ? imagePreview : ''
  const tokenIds = Object.keys(currentAsset.images)
  const images = yield all(tokenIds.map((tokenId) => getTokenImage({ tokenId, currentAsset, tokenContract }), {}))
  const imagesObj = images.reduce((sum, item) => {
    sum[item.tokenId] = item.image
    return sum
  }, {})
  const assetsUpdated = assets.map(item => {
    if (item.address === address) {
      item.images = imagesObj
    }
    return item
  })
  yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: assetsUpdated } })
  yield put({ type: '*TOKENS.SET_ERC721_DATA', payload: { address } })
  yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
}
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  assets: ({ tokens: { assetsERC721: assets } }) => assets
}

const getTokenImage = function * ({ tokenId, currentAsset, tokenContract }) {
  let metadataURL = ''
  // let image = currentAsset.address.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae' ? currentAsset.images[tokenId]  : ''
  let image = currentAsset.images[tokenId]
  try {
    if (image.length === 0) {
      if (tokenContract.tokenURI) {
        metadataURL = yield tokenContract.tokenURI(tokenId)
      }
      if (metadataURL !== '') {
        const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
        if (data) {
          image = data.image
        }
      }
    }
    return {
      image,
      tokenId
    }
  } catch (e) {
    return {
      image,
      tokenId
    }
  }
}

// const generator = function * ({ payload }) {
//   try {
//     yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
//     const { tokenAddress, chainId } = payload
//     yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
//     yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
//     const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
//     const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
//     const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
//     const symbol = yield tokenContract.symbol()
//     yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol } })
//     yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
//   } catch (e) {
//     console.error(e)
//   }
// }

export default generator
