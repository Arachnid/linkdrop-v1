/* global MASTER_COPY, IPFS_GATEWAY_URL, OPENSEA_API_KEY, JSON_RPC_URL_XDAI, INFURA_PK, FACTORY, CLAIM_HOST */
let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const claimHost = CLAIM_HOST || String(config.claimHost)
const infuraPk = INFURA_PK || String(config.infuraPk)
const openSeaApiKey = OPENSEA_API_KEY || String(config.openSeaApiKey)
const jsonRpcUrlXdai = JSON_RPC_URL_XDAI || String(config.jsonRpcUrlXdai)
const linksLimit = config.linksLimit || 1000
const ipfsGatewayUrl = IPFS_GATEWAY_URL || String(config.ipfsGatewayUrl)

module.exports = {
  claimHost,
  masterCopy,
  factory,
  openSeaApiKey,
  infuraPk,
  jsonRpcUrlXdai,
  linksLimit,
  ipfsGatewayUrl
}
