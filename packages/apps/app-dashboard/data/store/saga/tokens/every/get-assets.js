import { put, call, select } from 'redux-saga/effects'
import { getXDAIERC20Items, getERC20Items } from 'data/api/tokens'
import { defineNetworkName } from '@linkdrop/commons'
import getCurrentEthBalance from './get-current-eth-balance'

const generator = function * () {
  try {
    const currentAddress = yield select(generator.selectors.currentAddress)
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const { ethBalanceFormatted } = yield getCurrentEthBalance({ payload: { account: currentAddress, chainId } })
    yield put({
      type: 'TOKENS.SET_CURRENT_ETH_BALANCE',
      payload: {
        currentEthBalance: Math.round(ethBalanceFormatted * 1000) / 1000
      }
    })
    
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  currentAddress: ({ user: { currentAddress } }) => currentAddress
}
