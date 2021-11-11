import operationService from '../src/services/operationService'
import lastTxHashService from '../src/services/lastTxHashService'
import relayerWalletService from '../src/services/relayerWalletService'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
import { ethers } from 'ethers'
const BN = require('bn.js')

const getOperationId = () => {
  const args = process.argv.slice(2)
  if (args.length < 1) throw new Error('Please provide operation id')
  return args[0]
}

const getGasPrice = async () => {
  const args = process.argv.slice(2)
  let gasPrice = args[1]
  if (args.length < 2) {
      // gasPrice = 'auto'
      gasPrice = await relayerWalletService.provider.getGasPrice()
      console.log({ gasPrice })
      //gasPrice = ethers.utils.parseUnits(gasPrice, 'gwei').toString()
      return gasPrice
  }
  return ethers.utils.parseUnits(gasPrice, 'gwei')
}

export const retryTransactionByOperationId = async (operationId, gasPrice) => {
  await connectDB()
  let operation = await operationService.findById(operationId)
    logger.json(operation)

  const lastTxHash = await lastTxHashService.getLastTxHashById(operationId)
    operationService.retryTransaction(operationId, lastTxHash, gasPrice, true)
}

retryTransactionByOperationId(getOperationId(), getGasPrice())
