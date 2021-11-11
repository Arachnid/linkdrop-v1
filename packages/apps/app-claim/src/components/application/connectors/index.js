import { infuraPk } from 'app.config.js'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'

import { NetworkConnector } from "@web3-react/network-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'


import { defaultChainId } from 'app.config.js'

const POLLING_INTERVAL = 12000
const Metamask = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 100, 97, 56, 137, 80001]
})

const supportedNetworkURLs = {
  1: `https://mainnet.infura.io/v3/${infuraPk}`,
  4: `https://rinkeby.infura.io/v3/${infuraPk}`,
  3: `https://ropsten.infura.io/v3/${infuraPk}`,
  5: `https://goerli.infura.io/v3/${infuraPk}`,
  42: `https://kovan.infura.io/v3/${infuraPk}`
}

const Network = new NetworkConnector({
  urls: supportedNetworkURLs,
  defaultChainId: Number(defaultChainId)
})

const walletConnectRpc = {
  [Number(defaultChainId)]: 'https://rpc-mainnet.maticvigil.com/v1/ad4cd2ea018ddb1ccd0418ffa43c27b3d99fbd55'
}

const Walletconnect = new WalletConnectConnector({
  rpc: walletConnectRpc,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

const connectors = {
  Metamask,
  Network,
  Walletconnect
}

export default connectors
