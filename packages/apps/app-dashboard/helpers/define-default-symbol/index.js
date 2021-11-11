export default ({ chainId }) => {
  if (Number(chainId) === 100) { return 'xDAI' }
  if (Number(chainId) === 137) { return 'MATIC' }
  return 'ETH'
}
