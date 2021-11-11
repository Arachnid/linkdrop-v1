import { put, select, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC1155Mock from 'contracts/ERC1155Mock.json'
import { infuraPk, jsonRpcUrlXdai, ipfsGatewayUrl } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { getERC1155TokenData } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenId, linksAmount, callback } = payload
    if (!linksAmount) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return alert(`Set links amount for this token id in format: "tokenId / linksAmount" (example for two tokens of current tokenId: ${tokenId} / 2) `)
    }
    const currentAsset = yield select(generator.selectors.currentAsset)
    const chainId = yield select(generator.selectors.chainId)
    const userAddress = yield select(generator.selectors.address)
    if (!currentAsset) {
      return
    }
    const { address } = currentAsset
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(address, ERC1155Mock.abi, provider)
    const balance = yield tokenContract.balanceOf(userAddress, tokenId)
    if (Number(balance) <= 0) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return alert('Token not found')
    }
    const newAsset = {
      ...currentAsset,
      ids: [...currentAsset.ids, tokenId]
    }

    try {
      if (tokenContract.uri) {
        const metadataURL = yield tokenContract.uri(tokenId)
        if (metadataURL) {
          let actualUrl = metadataURL.includes('ipfs://') ? metadataURL.replace('ipfs://', ipfsGatewayUrl) : metadataURL
          const data = yield call(getERC1155TokenData, { metadataURL: actualUrl, tokenId })
          if (data) {
            newAsset.images = {
              ...newAsset.images,
              [tokenId]: data.image.includes('ipfs://') ? data.image.replace('ipfs://', ipfsGatewayUrl) : data.image
            }
            

            newAsset.names = {
              ...newAsset.names,
              [tokenId]: data.name || "ERC1155"
            }
          }
        }
      }
      yield put({ type: 'TOKENS.SET_ERC1155_SINGLE_ASSET', payload: { asset: newAsset } })
      callback && callback({ tokenId, linksAmount })
    } catch (e) {
      console.error(e)
      currentAsset.images = {
        ...currentAsset.images,
        [tokenId]: ''
      }

      currentAsset.names = {
        ...currentAsset.names,
        [tokenId]: ''
      }
      
      yield put({ type: 'TOKENS.SET_ERC1155_SINGLE_ASSET', payload: { asset: newAsset } })
      callback && callback({ tokenId, linksAmount })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    alert('Some error occured, check token address')
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  address: ({ user: { currentAddress } }) => currentAddress,
  currentAsset: ({ tokens: { erc1155SingleAsset } }) => erc1155SingleAsset,
}

export default generator
