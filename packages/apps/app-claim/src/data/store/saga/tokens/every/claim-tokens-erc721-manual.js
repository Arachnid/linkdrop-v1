import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory.json'
import { signReceiverAddress } from '@linkdrop/contracts/scripts/utils.js'
import { factory } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const {
      wallet,
      campaignId,
      nftAddress,
      tokenId,
      weiAmount,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      linkdropMasterAddress
    } = payload

    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })

    const linkId = new ethers.Wallet(linkKey).address
    const receiverSignature = yield signReceiverAddress(linkKey, wallet)
    const provider = yield select(generator.selectors.provider)
    const signer = yield provider.getSigner()

    const contract = new ethers.Contract(
      factory,
      LinkdropFactory.abi,
      signer
    )

    const { hash } = yield contract.claimERC721(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      wallet,
      receiverSignature,
    )

    if (hash) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: hash } })
      yield put({ type: 'USER.SET_STEP', payload: { step: 4 } })
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    const { message } = error
    
    if (message) {
      if (message.toLowerCase().includes('metamask')) {
        alert(message)
      } else {
        yield put({ type: 'USER.SET_ERRORS', payload: { errors: [message] } })
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })

  }
}

export default generator
generator.selectors = {
  provider: ({ user: { provider } }) => provider
}
