import fetch from '../fetch'
import { apiUrl } from 'app.config.js'

export default ({ address }) => {
  const host = `${apiUrl}/api/v1/auth/nft`
  return fetch(host, {
    method: 'POST',
    body: JSON.stringify({
      address
    })
  })
}
