import User from './user'
import Routing from './routing'
import Tokens from './tokens'
import Contract from './contract'
import Deeplinks from './deeplinks'
import Metamask from './metamask'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.routing = new Routing(this)
    this.user = new User(this)
    this.tokens = new Tokens(this)
    this.contract = new Contract(this)
    this.deeplinks = new Deeplinks(this)
    this.metamask = new Metamask(this)
  }
}

export default Actions
