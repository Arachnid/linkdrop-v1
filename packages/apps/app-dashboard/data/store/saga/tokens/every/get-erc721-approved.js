import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import ERC721Mock from 'contracts/ERC721Mock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const {
      tokenAddress,
      chainId,
      account, // proxy
      currentAddress // user address
    } = payload

    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, ERC721Mock.abi, provider)
    /* account - proxy, currentAddress - metamask address */
    const erc721IsApproved = yield tokenContract.isApprovedForAll(currentAddress, account)
    
    if (erc721IsApproved) {
      yield put({ type: 'TOKENS.SET_ERC721_IS_APPROVED', payload: { erc721IsApproved } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    alert('Something went wrong with isApprovedForAll contract method. Check transaction manually')
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'TOKENS.SET_ERC721_IS_APPROVED', payload: { erc721IsApproved: true } })
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ campaigns: { proxyAddress } }) => proxyAddress,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals
}
