import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC1155Mock from 'contracts/ERC1155Mock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, ERC1155Mock.abi, provider)
    const symbol = 'ERC1155'
    const asset = {
      address: tokenAddress,
      symbol,
      names: {},
      ids: [],
      images: {}
    }
    yield put({ type: 'TOKENS.SET_ERC1155_SINGLE_ASSET', payload: { asset } })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc1155' } })
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
