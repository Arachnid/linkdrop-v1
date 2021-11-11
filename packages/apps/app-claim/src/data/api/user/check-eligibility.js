import fetch from '../fetch'
import { apiUrl } from 'app.config.js'

export default ({ twitterName }) => {
  const host = `${apiUrl}/api/v1/auth/check?handle=${twitterName}`
  return fetch(host)
}
