import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({ tokens: { transactionId, transactionStatus } }) => ({ transactionId, transactionStatus }))
@translate('pages.main')
class ClaimingProcessPage extends React.Component {

componentDidMount () {
    const { linkKey, campaignId, nftAddress, tokenId, tokenAmount } = getHashVariables()
    if (nftAddress && tokenAmount) {
      return this.actions().tokens.checkTransactionStatus({
        linkKey,
        campaignId,
        type: 'erc1155'
      })
    }

    if (nftAddress) {
      return this.actions().tokens.checkTransactionStatus({
        linkKey,
        campaignId,
        type: 'erc721'
      })
    }

    return this.actions().tokens.checkTransactionStatus({
      linkKey,
      campaignId,
      type: 'erc20'
    })
    
  }

  render () {
    const { chainId, variant } = getHashVariables()
    const { transactionId } = this.props

    const scannerDct = {
      "100": 'seeDetailsBlockscout',      
      "97": 'seeDetailsBscScan',
      "56": 'seeDetailsBscScan',
      "137": 'seeDetailsExplorer',
    }
    const seeDetails = scannerDct[String(chainId)] || 'seeDetails'
    
    return <div className={commonStyles.container}>
      <Loading container size='small' className={styles.loading} />
      {this.renderTitle({ variant })}
      <div className={styles.subtitle}>{this.t('titles.transactionInProcess')}</div>
      <div className={styles.description}>{this.t('titles.instructions')}</div>
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t(`titles.${seeDetails}`, {
            transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
          })
        }}
      />
    </div>
  }

  renderTitle ({ variant }) {
    return <div className={styles.title}>
      {this.t(`titles.${variant ? 'claimingNFT' : 'claiming'}`)}
    </div>
  }
}

export default ClaimingProcessPage
