import { put, select, call, all, fork } from 'redux-saga/effects'
import getErc721SingleAssetToken from './get-erc721-single-asset-token'

const generator = function * ({ payload }) {
  const { range } = payload
  const [rangeFrom, rangeTo] = range
  const array = [...Array(Number(rangeTo) - Number(rangeFrom) + 1).keys()].map(x => x + Number(rangeFrom))
  for (let i = 0; i < array.length; i++) {
    yield call(getErc721SingleAssetToken, { payload: { tokenId: array[i] } })
  }
}

generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  address: ({ user: { currentAddress } }) => currentAddress,
  currentAsset: ({ tokens: { erc721SingleAsset } }) => erc721SingleAsset,
}

export default generator
