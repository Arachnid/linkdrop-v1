import fetch from '../fetch'

export default ({ erc721URL }) => fetch(erc721URL, { disableDefaults: true, timeout: 5000 })
