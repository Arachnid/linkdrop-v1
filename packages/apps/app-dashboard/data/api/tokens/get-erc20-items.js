import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ address, networkName }) => {
  const apiPrefix = networkName === 'kovan' ? 'kovan-api' : 'api'
  return fetch(`https://${apiPrefix}.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`, { disableDefaults: true })
}
