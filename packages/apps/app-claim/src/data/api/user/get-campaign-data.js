import fetch from '../fetch'
import { apiUrl } from 'app.config.js'

export default ({ public_key, fingerprint, count, browser, device }) => {
  const host = `${apiUrl}/api/v1/data`
  return fetch(host, { method: 'POST', body: JSON.stringify({
    public_key, fingerprint, count, browser, device
  })
})}
