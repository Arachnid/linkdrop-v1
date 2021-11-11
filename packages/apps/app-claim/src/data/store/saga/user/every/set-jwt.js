import { put, call, select } from 'redux-saga/effects'
import { sendData } from 'data/api/user'
import { defineNetworkName, getHashVariables } from '@linkdrop/commons'
import { delay } from 'redux-saga'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { jwt } = payload
    yield put({ type: 'USER.SET_JWT', payload: { jwt } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 7 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}