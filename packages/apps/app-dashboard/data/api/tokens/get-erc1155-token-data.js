import fetch from '../fetch'

export default ({ metadataURL, tokenId }) => {
  const tokenDataURL = metadataURL.replace('0x{id}', tokenId)
  return fetch(tokenDataURL)
}
