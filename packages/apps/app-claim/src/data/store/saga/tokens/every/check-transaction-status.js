import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { infuraPk } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import LinkdropMastercopy from '@linkdrop/contracts/build/LinkdropMastercopy.json'

const generator = function * ({ payload }) {
  try {
    const {
      linkKey,
      campaignId,
      type
    } = payload

    const provider = yield select(generator.selectors.provider)
    const signer = yield provider.getSigner()
    const sdk = yield select(generator.selectors.sdk)


    const linkId = new ethers.Wallet(linkKey).address
    const proxyAddress = sdk.getProxyAddress(campaignId)
    const contract = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      provider
    )

    if (type === 'erc1155') {
      const filter = contract.filters.ClaimedERC1155(linkId)

      const eventListener = new Promise((resolve, reject) => {
        contract.on(filter, (linkId, ethAmount, nftAddress, tokenId, tokenAmount, receiver, event) => { 
          const { transactionHash } = event
          console.log({ event })
          resolve(transactionHash)
        })
      })
      const transactionHash = yield eventListener

      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: transactionHash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
    }

    if (type === 'erc20') {
      const filter = contract.filters.Claimed(linkId)
      const eventListener = new Promise((resolve, reject) => {
        contract.on(filter, (linkId, ethAmount, token, tokenAmount, receiver, event) => { 
          const { transactionHash } = event
          resolve(transactionHash)
        })
      })
      const transactionHash = yield eventListener
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: transactionHash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
    }

    if (type === 'erc721') {
      const filter = contract.filters.ClaimedERC721(linkId)
      const eventListener = new Promise((resolve, reject) => {
        contract.on(filter, (linkId, ethAmount, nft, tokenId, receiver, event) => { 
          const { transactionHash } = event
          resolve(transactionHash)
        })
      })
      const transactionHash = yield eventListener
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: transactionHash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  provider: ({ user: { provider } }) => provider
}

