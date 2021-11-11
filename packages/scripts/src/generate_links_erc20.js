import ERC20Mock from '../../contracts/build/ERC20Mock'
import LinkdropSDK from '@linkdrop/sdk'

import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import {
  newError,
  getString,
  getInt,
  getLinkdropMasterWallet,
  getExpirationTime,
  getProvider
} from './utils'

import deployProxyIfNeeded from './deploy_proxy'
const JSON_RPC_URL = getString('jsonRpcUrl')
const CHAIN = getString('CHAIN')
const LINKDROP_MASTER_PRIVATE_KEY = getString('linkdropMasterPrivateKey')
const WEI_AMOUNT = ethers.utils.bigNumberify(getString('weiAmount'))
const LINKS_NUMBER = getInt('linksNumber')
const EXPIRATION_TIME = getExpirationTime()
const TOKEN_ADDRESS = getString('tokenAddress')
const TOKEN_AMOUNT = ethers.utils.bigNumberify(getString('tokenAmount'))
const PROVIDER = getProvider()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const CAMPAIGN_ID = getInt('CAMPAIGN_ID')
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')

const GAS_FEE = ethers.utils.parseUnits('0')
const DEFAULT_WALLET = getString('DEFAULT_WALLET')

// Initialize linkdrop SDK
const linkdropSDK = new LinkdropSDK({
  linkdropMasterAddress: new ethers.Wallet(LINKDROP_MASTER_PRIVATE_KEY).address,
  factoryAddress: FACTORY_ADDRESS,
  chain: CHAIN,
  jsonRpcUrl: JSON_RPC_URL
})

export const generate = async () => {
  let spinner, tx
  try {
    spinner = ora({
      text: term.bold.green.str('Generating links'),
      color: 'green'
    })
    spinner.start()

    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

    // check that proxy address is deployed
    await deployProxyIfNeeded(spinner)

    // Send tokens to proxy
    if (TOKEN_AMOUNT.gt(0) && TOKEN_ADDRESS !== ethers.constants.AddressZero) {
      const cost = TOKEN_AMOUNT.mul(LINKS_NUMBER)

      const tokenContract = await new ethers.Contract(
        TOKEN_ADDRESS,
        ERC20Mock.abi,
        LINKDROP_MASTER_WALLET
      )
      const tokenSymbol = await tokenContract.symbol()
      const tokenDecimals = await tokenContract.decimals()

      // Approve tokens
      const proxyAllowance = await tokenContract.allowance(
        LINKDROP_MASTER_WALLET.address,
        proxyAddress
      )
      if (proxyAllowance.lt(cost)) {
        spinner.info(
          term.bold.str(
            `Approving ${cost /
              Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
          )
        )

        tx = await tokenContract.approve(proxyAddress, cost, {
          gasLimit: 600000
        })
        term.bold(`Tx Hash: ^g${tx.hash}\n`)
      }
    }

    if (WEI_AMOUNT > 0) {
      // Transfer ethers
      const cost = WEI_AMOUNT.mul(LINKS_NUMBER)
      let amountToSend

      const tokenSymbol = 'ETH'
      const tokenDecimals = 18
      const proxyBalance = await PROVIDER.getBalance(proxyAddress)

      if (proxyBalance.lt(cost)) {
        amountToSend = cost.sub(proxyBalance)

        spinner.info(
          term.bold.str(
            `Sending ${amountToSend /
              Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
          )
        )

        tx = await LINKDROP_MASTER_WALLET.sendTransaction({
          to: proxyAddress,
          value: amountToSend,
          gasLimit: 33000
        })

        term.bold(`Tx Hash: ^g${tx.hash}\n`)
      }
    }


    // Generate links
    const links = []

    for (let i = 0; i < LINKS_NUMBER; i++) {
      const {
        url,
        linkId,
        linkKey,
        linkdropSignerSignature
      } = await linkdropSDK.generateLink({
        signingKeyOrWallet: LINKDROP_MASTER_PRIVATE_KEY,
        weiAmount: WEI_AMOUNT,
        tokenAddress: TOKEN_ADDRESS,
        tokenAmount: TOKEN_AMOUNT,
        expirationTime: EXPIRATION_TIME,
        campaignId: CAMPAIGN_ID,
        wallet: DEFAULT_WALLET
      })

      const link = { i, linkId, linkKey, linkdropSignerSignature, url }
      links.push(link)
    }

    // Save links
    const dir = path.join(__dirname, '../output')
    const filename = path.join(dir, 'linkdrop_erc20.csv')

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const ws = fs.createWriteStream(filename)
      fastcsv.write(links, { headers: true }).pipe(ws)
    } catch (err) {
      throw newError(err)
    }

    spinner.succeed(term.bold.str(`Generated and saved links to ^_${filename}`))

    return links
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to generate links'))
    throw newError(err)
  }
}

generate()
