import logger from './../utils/logger'
import axios from 'axios'
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
import configs from '../../../../configs'
const config = configs.get('auth')

class Auth0Service {
  constructor () {
    this.client = jwksClient({
      cache: true,
      strictSsl: true, // Default value
      jwksUri: `${config.AUTH0_DOMAIN}/.well-known/jwks.json`,
      requestHeaders: {}, // Optional
      requestAgentOptions: {} // Optional
    })
  }

  _getPubKey (kid) {
    // logger.debug(`Getting pubkey for ${kid}`)
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(kid, (err, key) => {
        if (err) return reject(err)
        const signingKey = key.publicKey || key.rsaPublicKey
        resolve(signingKey)
      })
    })
  }

  async validateAuthToken (token) {
    try {
      var decoded = jwt.decode(token, { complete: true })
      logger.json(decoded.header)
      const pubKey = await this._getPubKey(decoded.header.kid)
      // logger.debug({ pubKey })
      const decodedVerified = jwt.verify(token, pubKey, { algorithms: ['RS256'] })
      const { email, email_verified: verified } = decodedVerified
      logger.json(decoded)
      if (!verified) {
        logger.debug(`Email is not verified ${email}`)
        return null
      }

      logger.info(`Got email from token ${email}`)
      return email
    } catch (err) {
      logger.error('Error whlie decoding Token Id')
      logger.error(err)
    }
    return null
  }  
}

export default new Auth0Service()
