import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { convertFromExponents } from '@linkdrop/commons'
import { multiply, bignumber } from 'mathjs'
import { defineDefaultSymbol } from 'helpers'

@actions(({
  user: {
    chainId
  },
  campaigns: {
    ethAmount,
    linksAmount,
    tokenType
  }
}) => ({
  chainId,
  linksAmount,
  ethAmount,
  tokenType
}))
@translate('pages.campaignCreate')
class EthAmountData extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { ethAmount, linksAmount, tokenType } = this.props
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    const totalLinks = tokenType === 'erc1155' ? linksAmount.length : linksAmount
    return <div className={styles.data}>
      <h3 className={styles.dataTitle}>
        {this.t('titles.totalEthInLinks', { symbol: this.defaultSymbol })}
      </h3>
      <div className={styles.dataContent}>
        {convertFromExponents(multiply(bignumber(ethAmount), bignumber(linksAmount)))} {this.defaultSymbol}
      </div>
      <div className={styles.extraDataContent}>
        {this.t('titles.ethHold')}
      </div>
    </div>
  }
}

export default EthAmountData
