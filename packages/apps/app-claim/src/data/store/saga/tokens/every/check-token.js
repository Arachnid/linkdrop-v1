import { put, select, call } from 'redux-saga/effects'
import { infuraPk, contractAddress } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { ethers } from 'ethers'
import {
  claim
} from 'data/api/tokens'
import getToken1155Data from 'data/store/saga/contract/every/get-token1155-data'

import ERC1155Mock from 'data/abi/ERC1155Mock.json'


const generator = function * ({ payload }) {
  try {
    const { wallet, chainId } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const finalContract = yield new ethers.Contract(contractAddress, ERC1155Mock.abi, provider)
    const finalTokenCount = yield finalContract.balanceOf(wallet, 1)
    const finalTokens = Number(finalTokenCount)
    
    if (finalTokens > 0) {
      return yield put({ type: 'USER.SET_STEP', payload: { step: 14 } })
    }

    yield put({ type: 'USER.SET_STEP', payload: { step: 6 } })

    // const contract = yield new ethers.Contract('0x4Ec174ce35ACAd1CD9b3BE80A638B1fEEc76eE07', ERC721.abi, provider)

    // const tokenCount = yield contract.balanceOf(wallet)
    // const tokens = Number(tokenCount)

    // if (tokens > 0) {
    //   yield put({ type: 'USER.SET_STEP', payload: { step: 8 } })
    // } else {
    //   yield put({ type: 'USER.SET_STEP', payload: { step: 6 } })
    // }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    console.log({ error })
    yield put({ type: 'USER.SET_STEP', payload: { step: 6 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator

