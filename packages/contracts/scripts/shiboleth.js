import { utils } from 'ethers'
const ethers = require('ethers')

export const generateClaimCode = async (issuerkey, validator, data) => {
  const claimkeyWallet = ethers.Wallet.createRandom()
  const claimkey = claimkeyWallet.privateKey
  const claimant = claimkeyWallet.address
  
  const datahash = ethers.utils.solidityKeccak256(
    ['bytes'],
    [data]
  )

  // Authorisation messages have the following format:
  // ┌────────┬───────────┬───────┬──────────┬──────────┐
  // │ prefix │ validator │ type  │ datahash │ claimant │
  // ├────────┼───────────┼───────┼──────────┼──────────┤
  // │ 0x1900 │ address   │ 0x00  │ bytes32  │ address  │
  // └────────┴───────────┴───────┴──────────┴──────────┘
  const authhash = ethers.utils.solidityKeccak256(
    ['bytes', 'address', 'bytes', 'bytes32', 'address'],
    [utils.hexlify(1900), validator, '0x00', datahash, claimant]
  )

  const issuer = new ethers.Wallet(issuerkey)
  const authsig = await issuer.signMessage(authhash)
  
  return { claimkey, authsig }
}


export const generateClaimSig = async (claimkey, validator, beneficiary, authsig) => {
  const authhash = ethers.utils.solidityKeccak256(
    ['bytes'],
    [authsig]
  )
  
  // Claim messages have the following format:
  // ┌────────┬───────────┬───────┬──────────┬─────────────┐
  // │ prefix │ validator │ type  │ authhash │ beneficiary │
  // ├────────┼───────────┼───────┼──────────┼─────────────┤
  // │ 0x1900 │ address   │ 0x80  │ bytes32  │ address     │
  // └────────┴───────────┴───────┴──────────┴─────────────┘
  const claimhash = ethers.utils.solidityKeccak256(
    ['bytes', 'address', 'bytes', 'bytes32', 'address'],
    [utils.hexlify(1900), validator, '0x80', authhash, beneficiary]
  )
  
  
  const issuer = new ethers.Wallet(claimkey)
  const claimsig = await issuer.signMessage(authhash)
  
  return { claimsig }
}
