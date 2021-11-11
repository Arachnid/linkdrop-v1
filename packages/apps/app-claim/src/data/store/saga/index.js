import tokens from './tokens'
import contract from './contract'
import user from './user'
import deeplinks from './deeplinks'
import metamask from './metamask'

function * saga () {
  yield * tokens()
  yield * contract()
  yield * user()
  yield * deeplinks()
  yield * metamask()
}

export default saga
