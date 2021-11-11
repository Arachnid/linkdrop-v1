import fetch from '../fetch'
import { apiUrl } from 'app.config.js'

export default ({
  address,
  twitterLink,
  browser,
  device,
  fingerprint,
  public_key,
  private_key,
  count
  }) => {
  const host = `${apiUrl}/api/v1/get-link`
  return fetch(host, {
    method: 'POST',
    body: JSON.stringify({
      address,
      tweet_link: twitterLink,
      browser,
      device,
      fingerprint,
      public_key,
      private_key,
      count
    })
  })
}
