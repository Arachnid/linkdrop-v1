import { put, call, select, all } from 'redux-saga/effects'
import { getERC721Items, getERC721TokenData, getXdaiERC721Items } from 'data/api/tokens'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const getTokenIds = function * ({
  tokenAddress,
  provider,
  address,
  symbol,
  name
}) {
  const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
  const numberOfTokens = yield tokenContract.balanceOf(address)
  const tokens = []
  for (let i = 0; i < Number(numberOfTokens); i++) {
    const token = yield tokenContract.tokenOfOwnerByIndex(address, i)
    const tokenId = yield token.toString()
    let image = ''
    let metadataURL = ''
    let tokenData = {
      tokenId,
      address: tokenAddress,
      symbol,
      name: `${name} - ${tokenId}`
    }
    try {
      metadataURL = yield tokenContract.tokenURI(tokenId)
      if (metadataURL !== '') {
        const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
        if (data) {
          image = data.image
        }
      }

      tokenData = {
        ...tokenData,
        image
      }
    } catch (e) {
      tokenData = {
        ...tokenData,
        image: ''
      }
    }
    
    tokens.push({
      tokenId,
      address: tokenAddress,
      symbol,
      name,
      image: ''
    })
  }
  return tokens
}

const getTokens = function * ({ actualJsonRpcUrl, provider, currentAddress, networkName, page }) {
  const { assets } = yield call(getERC721Items, { address: currentAddress, networkName, page })
  if (assets) {
    const assetsFormatted = yield all(assets.map(({ image_preview_url: imagePreview, token_id: tokenId, asset_contract: { address, symbol, name: contractName }, name }) => getInitialTokenData({ imagePreview, tokenId, address, contractName, name, symbol })))
    const assetsMerged = assetsFormatted.reduce((sum, { tokenId, address, symbol, name, image }) => {
      if (sum[address]) {
        sum[address] = { ...sum[address], names: { ...sum[address].names, [tokenId]: name }, ids: [...sum[address].ids, tokenId], images: { ...sum[address].images, [tokenId]: image } }
      } else {
        sum[address] = { address, symbol, names: { [tokenId]: name }, ids: [tokenId], images: { [tokenId]: image } }
      }
      return sum
    }, {})
    const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
    yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}

const getTokensXdai = function * ({ currentAddress, provider }) {
  const { result: assets } = yield call(getXdaiERC721Items, { address: currentAddress })
  if (assets) {
    const assetsFiltered = assets.filter(({ type }) => type === 'ERC-721')
    const assetsFormatted = yield all(assetsFiltered.map(({ contractAddress, name, symbol }) => call(getTokenIds, { tokenAddress: contractAddress, provider, address: currentAddress, symbol, name })))
    const assetsFlat = [].concat.apply([], assetsFormatted)
    const assetsMerged = assetsFlat.reduce((sum, { tokenId, address, symbol, name, image }) => {
      if (sum[address]) {
        sum[address] = { ...sum[address], names: { ...sum[address].names, [tokenId]: name }, ids: [...sum[address].ids, tokenId], images: { ...sum[address].images, [tokenId]: image } }
      } else {
        sum[address] = { address, symbol, names: { [tokenId]: name }, ids: [tokenId], images: { [tokenId]: image } }
      }
      return sum
    }, {})
    const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
    yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}
 
const defineSymbol = function * ({ tokenContract, address }) {
  try {
    const symbol = yield tokenContract.symbol()
    return symbol
  } catch (e) {
    return `NFT-${address.slice(0, 3)}`
  }
}

const getInitialTokenData = function * ({ contractName, tokenId, address, name, imagePreview, symbol }) {
  return {
    tokenId,
    address,
    symbol: symbol || contractName,
    name,
    image: imagePreview
  }
}



const generator = function * ({ payload }) {
  try {
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: true } })
    const { page, currentAddress } = payload

    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    if (networkName === 'xdai') {
      yield getTokensXdai({ currentAddress, provider })
    } else {
      yield getTokens({ actualJsonRpcUrl, provider, currentAddress, networkName, page })
    }
    
  } catch (e) {
    console.error(e)
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  web3Provider: ({ user: { web3Provider } }) => web3Provider
}
