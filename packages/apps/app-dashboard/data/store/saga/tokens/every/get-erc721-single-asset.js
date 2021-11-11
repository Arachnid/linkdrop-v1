import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC721Mock from 'contracts/ERC721Mock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, ERC721Mock.abi, provider)
    const symbol = yield tokenContract.symbol() 
    const asset = {
      address: tokenAddress,
      symbol,
      names: {},
      ids: [],
      images: {}
    }
    yield put({ type: 'TOKENS.SET_ERC721_SINGLE_ASSET', payload: { asset } })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    alert('Some error occured, check token address')
  }
}

generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}

export default generator
