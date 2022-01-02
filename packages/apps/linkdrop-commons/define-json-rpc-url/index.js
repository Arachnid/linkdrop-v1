import defineNetworkName from '../define-network-name'

export default ({ chainId, infuraPk }) => {
  const networkName = defineNetworkName({ chainId })
  // if (networkName === 'xdai' || networkName === 'bsc-testnet') { return jsonRpcUrlCustom }

  if (String(chainId) === '100') {
    return 'https://rpc.xdaichain.com/'
  } else if (String(chainId) === '97') {
    return 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  } else if (String(chainId) === '56') {
    return 'https://bsc-dataseed1.defibit.io/'
  } else if (String(chainId) === '137') {    
    return 'https://rpc-mainnet.maticvigil.com/v1/ad4cd2ea018ddb1ccd0418ffa43c27b3d99fbd55'
  } else if (String(chainId) === '43114') {
    return 'https://api.avax.network/ext/bc/C/rpc'
  } else if (String(chainId) === '80001') {
    return 'https://rpc-mumbai.maticvigil.com/v1/f592ae2e5afb3bebe39314e9bd0949de5b74cd2f'
  }
  
  return `https://${networkName}.infura.io/v3/${infuraPk}`
}
