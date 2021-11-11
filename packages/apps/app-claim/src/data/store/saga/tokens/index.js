import { takeEvery } from 'redux-saga/effects'

import claimTokensERC20 from './every/claim-tokens-erc20'
import claimTokensERC721 from './every/claim-tokens-erc721'
import claimTokensERC1155 from './every/claim-tokens-erc1155'
import claimTokensERC20Manual from './every/claim-tokens-erc20-manual'
import claimTokensERC721Manual from './every/claim-tokens-erc721-manual'
import claimTokensERC1155Manual from './every/claim-tokens-erc1155-manual'


import checkTransactionStatus from './every/check-transaction-status'
import checkIfClaimed from './every/check-if-claimed'

export default function * () {
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC20', claimTokensERC20)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC721', claimTokensERC721)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC1155', claimTokensERC1155)

  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC20_MANUAL', claimTokensERC20Manual)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC721_MANUAL', claimTokensERC721Manual)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC1155_MANUAL', claimTokensERC1155Manual)


  yield takeEvery('*TOKENS.CHECK_TRANSACTION_STATUS', checkTransactionStatus)
  yield takeEvery('*TOKENS.CHECK_IF_CLAIMED', checkIfClaimed)
}
