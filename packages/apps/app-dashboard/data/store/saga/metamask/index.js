import { takeEvery } from 'redux-saga/effects'

import sendEth from './every/send-eth'
import sendErc20 from './every/send-erc20'
import sendErc721 from './every/send-erc721'
import sendErc1155 from './every/send-erc1155'

export default function * () {
  yield takeEvery('*METAMASK.SEND_ETH', sendEth)
  yield takeEvery('*METAMASK.SEND_ERC20', sendErc20)
  yield takeEvery('*METAMASK.SEND_ERC721', sendErc721)
  yield takeEvery('*METAMASK.SEND_ERC1155', sendErc1155)
}
