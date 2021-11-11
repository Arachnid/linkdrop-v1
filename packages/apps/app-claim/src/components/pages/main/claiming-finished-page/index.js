import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { Input } from 'components/common'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'
import { contractAddress } from 'app.config.js'
import { RoundedButton } from 'components/common'

@actions(({
  tokens: {
    transactionId,
    transactionStatus,
    tokenId
  },
  user: {
    loading,
    sendDataStatus
  },
  contract: {
    icon,
    symbol
  }
}) => ({
  transactionId,
  transactionStatus,
  tokenId,
  loading,
  sendDataStatus,
  icon,
  symbol
}))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { chainId, transactionId, amount, tokenId, wallet, icon, symbol, transactionStatus, loading, sendDataStatus, title } = this.props
    return <div className={commonStyles.container}>
      {tokenId ? <img
        className={styles.icon}
        src={icon}
      /> : <Alert
        icon={transactionStatus === 'failed' ? <Icons.Exclamation /> : <Icons.Check />}
        className={styles.alert}
      />}
      {this.renderTitles({ transactionStatus, amount, symbol, title })}
      {this.renderTokenCheckInstruction({ tokenId, chainId })}
      {this.renderEtherscanUrl({ transactionId, chainId })}
    </div>
  }


  renderTitles ({ transactionStatus, amount, symbol, title }) {
    if (title) {
      return <div
        className={styles.title}
      >
        {title}
      </div>
    }
    return <div
      className={styles.title}
      dangerouslySetInnerHTML={{
        __html: this.t(transactionStatus === 'failed' ? 'titles.claimFailed' : 'titles.tokensClaimed', {
          tokens: `${amount || ''} ${symbol}`
        })
      }}
    />
  }

  renderEtherscanUrl ({ transactionId, chainId }) {
    const scannerDct = {
      "100": 'seeDetailsBlockscout',      
      "97": 'seeDetailsBscScan',
      "56": 'seeDetailsBscScan',
      "137": 'seeDetailsExplorer',
      "80001": 'seeDetailsExplorer'
    }
    const seeDetails = scannerDct[String(chainId)] || 'seeDetails'

    return <div
      className={classNames(styles.description, {
        [styles.descriptionHidden]: !transactionId
      })}
      dangerouslySetInnerHTML={{
        __html: this.t(`titles.${seeDetails}`, {
          transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
        })
      }}
    />
  }


  renderTokenCheckInstruction ({ tokenId, chainId }) {
    const link = tokenId ? this.getOpenseaUrl({ tokenId, chainId }) : 'https://opensea.io/collection/gzy-first-come'
    const title = tokenId ? 'Open on Opensea' : 'View collection on OpenSea'
    return <RoundedButton
      className={styles.button}
      onClick={_ => {
        gtag('event', 'opensea_opened', {
          'event_label': 'opensea opened',
          'event_category': 'opensea_opened'
        });
        window.open(link, '_blank')
      }}
    >
      {title}
    </RoundedButton>
  }

  getOpenseaUrl ({ tokenId, chainId }) {
    if (Number(chainId) === 80001) {
      return `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
    }
    return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
  }
}

export default ClaimingFinishedPage
