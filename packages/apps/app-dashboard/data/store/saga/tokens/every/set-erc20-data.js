import { put, select } from 'redux-saga/effects'
import ERC20Mock from 'contracts/ERC20Mock.json'
import { ethers } from 'ethers'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import getCurrentTokenBalance from './get-current-token-balance'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress } = payload
    const currentAddress = yield select(generator.selectors.currentAddress)
    console.log({ currentAddress })
    // 0x85d1f0d5ea43e6f31d4f6d1f302405373e095722
    const assets = yield select(generator.selectors.assets)
    const chainId = yield select(generator.selectors.chainId)
    const { symbol, decimals } = assets.find(asset => asset.address === tokenAddress)

    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)

    const tokenContract = yield new ethers.Contract(tokenAddress, ERC20Mock.abi, provider)
    const { tokenBalance, tokenBalanceFormatted } = yield getCurrentTokenBalance({ payload: { decimals, contract: tokenContract, account: currentAddress } })
    yield put({
      type: 'TOKENS.SET_CURRENT_TOKEN_BALANCE',
      payload: {
        currentTokenBalance: Math.round(tokenBalanceFormatted * 100) / 100
      }
    })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    yield put({ type: 'TOKENS.SET_TOKEN_DECIMALS', payload: { decimals } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  assets: ({ tokens: { assets } }) => assets,
  chainId: ({ user: { chainId } }) => chainId,
  currentAddress: ({ user: { currentAddress } }) => currentAddress
}
