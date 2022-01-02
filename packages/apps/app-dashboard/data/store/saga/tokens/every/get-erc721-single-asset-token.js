import { put, select, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC721Mock from 'contracts/ERC721Mock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { getERC721TokenData } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenId } = payload
    const currentAsset = yield select(generator.selectors.currentAsset)
    const chainId = yield select(generator.selectors.chainId)
    const userAddress = yield select(generator.selectors.address)
    if (!currentAsset) {
      return
    }
    const { address } = currentAsset
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(address, ERC721Mock.abi, provider)
    const isOwner = yield tokenContract.ownerOf(tokenId)
    if (isOwner !== userAddress) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      return alert(`Token ${tokenId} was not found on address ${userAddress}`)
    }
    const newAsset = {
      ...currentAsset,
      ids: [...currentAsset.ids, tokenId]
    }

    yield put({ type: 'TOKENS.SET_ERC721_SINGLE_ASSET', payload: { asset: newAsset } })

    // try {
    //   if (tokenContract.tokenURI) {
    //     const metadataURL = yield tokenContract.tokenURI(tokenId)
    //     console.log({ metadataURL })
    //     if (metadataURL) {
    //       const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    //       if (data) {
    //         newAsset.images = {
    //           ...newAsset.images,
    //           [tokenId]: data.image
    //         }
    //         newAsset.names = {
    //           ...newAsset.names,
    //           [tokenId]: data.name
    //         }
    //       }
    //     }
    //   }
    //   yield put({ type: 'TOKENS.SET_ERC721_SINGLE_ASSET', payload: { asset: newAsset } })
    // } catch (e) {
    //   console.error(e)
    //   currentAsset.images = {
    //     ...currentAsset.images,
    //     [tokenId]: ''
    //   }

    //   currentAsset.names = {
    //     ...currentAsset.names,
    //     [tokenId]: ''
    //   }
    //   yield put({ type: 'TOKENS.SET_ERC721_SINGLE_ASSET', payload: { asset: newAsset } })
    // }

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
  currentAsset: ({ tokens: { erc721SingleAsset } }) => erc721SingleAsset,
}

export default generator
