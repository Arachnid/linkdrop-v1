import configs from '../../../../configs'
import { BigNumber } from 'bignumber.js'
const BN = require('bn.js')

const config = configs.get('server')
const {
  jsonRpcUrl,
  relayerPrivateKey,
  DEFAULT_GAS_PRICE,
  MAX_GAS_PRICE,
  K,
  C
} = config

const ethers = require('ethers')
ethers.errors.setLogLevel('error')

if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw new Error('Please provide json rpc url')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw new Error('Please provide relayer private key')
}

class AutoNonceWallet extends ethers.Wallet {
  sendTransaction (transaction) {
    if (transaction.nonce == null) {
      if (this._noncePromise == null) {
        this._noncePromise = this.provider.getTransactionCount(this.address)
      }
      transaction.nonce = this._noncePromise
      this._noncePromise = this._noncePromise.then(nonce => nonce + 1)
    }
    return super.sendTransaction(transaction)
  }
}

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    this.relayerWallet = new AutoNonceWallet(relayerPrivateKey, this.provider)
  }

  async getGasPrice () {
    let gasPrice

    if (!DEFAULT_GAS_PRICE || DEFAULT_GAS_PRICE === 'auto') {
      let currentGasPrice = await this.provider.getGasPrice()

      if (K != null && K !== '' && C != null && C !== '') {
        currentGasPrice = BigNumber(currentGasPrice)
        currentGasPrice = currentGasPrice.multipliedBy(BigNumber(K))
        currentGasPrice = currentGasPrice.plus(
          BigNumber(ethers.utils.parseUnits(C, 'gwei'))
        )
        currentGasPrice = ethers.utils.bigNumberify(
          currentGasPrice.toFixed(0).toString()
        )
      }

      gasPrice = BN.min(
        new BN(currentGasPrice.toString()),
        new BN(ethers.utils.parseUnits(MAX_GAS_PRICE, 'gwei').toString())
      )
    } else {
      gasPrice = BN.min(
        new BN(ethers.utils.parseUnits(DEFAULT_GAS_PRICE, 'gwei').toString()),
        new BN(ethers.utils.parseUnits(MAX_GAS_PRICE, 'gwei').toString())
      )
    }
    return ethers.utils.bigNumberify(gasPrice.toString())
  }
}

export default new RelayerWalletService()
