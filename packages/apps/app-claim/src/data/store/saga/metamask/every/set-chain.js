/* global ethereum */

import { put } from 'redux-saga/effects'
import chains from 'chains'
import { toHex } from 'helpers'
//  Wrap with Web3Provider from ethers.js


const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const {
      chainIdToSet,
      connector
    } = payload

    

    const chainObj = chains[chainIdToSet]
    const provider = connector.walletConnectProvider || ethereum

    if (chainObj) {
      const data = {
        ...chainObj,
        chainId: `0x${toHex(chainIdToSet)}`
      }
     provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [data]
        })
        .then(res => {
          if (res === null) {
            window.location.reload()
          }
        })
    }
    return 
    
  } catch (e) {
    console.error(e)
  }
}

export default generator
