import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { Input, RoundedButton } from 'components/common'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl, defineNetworkName, shortenString } from '@linkdrop/commons'
import classNames from 'classnames'
import FakeCheckbox from './fake-checkbox.png'

@actions(({
  tokens: {
    transactionId,
    transactionStatus
  },
  user: {
    loading,
    sendDataStatus
  }
}) => ({
  transactionId,
  transactionStatus,
  loading,
  sendDataStatus
}))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formShow: false,
      email: '',
      iconType: 'default'
    }
  }

  render () {
    const { chainId, dappId, subscribe, tokenId, nftAddress, src = 'opensea' } = getHashVariables()
    const { formShow, email, iconType } = this.state
    const { transactionId, icon, amount, wallet, symbol, transactionStatus, loading, sendDataStatus } = this.props
    return <div className={classNames(commonStyles.container, styles.container, {
      [styles.formShow]: formShow
    })}>
      {this.renderIcon({ transactionStatus, icon, symbol, nftAddress, iconType })}
      {this.renderTitles({ transactionStatus, amount, symbol, wallet })}
      {this.renderEtherscanUrl({ transactionId, chainId })}
      {this.renderDappButton({ dappId, transactionId, transactionStatus })}
      {this.renderWatchTokenButton({ tokenId, nftAddress, chainId, src })}
      {this.renderSubscribeForm({ subscribe, wallet, email, loading, sendDataStatus, transactionId })}
    </div>
  }

  renderIcon ({ transactionStatus, icon, symbol, nftAddress, iconType }) {
    if (transactionStatus === 'failed') {
      return <Alert
        icon={<Icons.Exclamation />}
        className={styles.alert}
      />
    }

    if (!icon || iconType === 'blank') {
      return <Alert
        icon={<Icons.Check />}
        className={styles.alert}
      />
    }

    return <Alert
      noBorder={symbol !== 'ETH' && symbol !== 'xDAI'}
      className={classNames(styles.tokenIcon, {
        [styles.tokenIconNft]: nftAddress
      })}
      icon={<img
        onError={_ => {
          if (iconType === 'blank') { return }
          this.setState({ iconType: 'blank' })
        }}
        className={styles.icon}
        src={icon}
      />}
    />
  }

  renderTitles ({ transactionStatus, amount, symbol, wallet }) {
    if (transactionStatus === 'failed') {
      return <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.claimFailed')
        }}
      />
    }
    const token = amount ? `${parseFloat(amount)} ${symbol}` : symbol
    if (wallet) {
      return <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.claimedWithWallet', {
            token,
            wallet: shortenString({ wallet })
          })
        }}
      />
    }
    return <div
      className={styles.title}
      dangerouslySetInnerHTML={{
        __html: this.t('titles.claimedWithNoWallet', {
          token
        })
      }}
    /> 
  }

  renderEtherscanUrl ({ transactionId, chainId }) {
    if (!transactionId) { return null }
    const scannerDct = {
      "100": 'seeDetailsBlockscout',      
      "97": 'seeDetailsBscScan',
      "56": 'seeDetailsBscScan',
      "137": 'seeDetailsExplorer',
    }
    const seeDetails = scannerDct[String(chainId)] || 'seeDetails'

    return <div
      className={styles.description}
      dangerouslySetInnerHTML={{
        __html: this.t(`titles.${seeDetails}`, {
          transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
        })
      }}
    />
  }

  renderDappButton ({ dappId, transactionId, transactionStatus }) {
    if (transactionStatus === 'failed') { return null }
    const dappData = getDappData({ dappId })
    if (!dappData) { return null }
    return <RoundedButton
      className={classNames(styles.button, {
        [styles.disableTranslateY]: !transactionId
      })}
      target='_blank'
      href={dappData.link}
    >
      {this.t('buttons.goTo', { dapp: dappData.name })}
    </RoundedButton>
  }

  renderWatchTokenButton ({ tokenId, nftAddress, chainId, src = 'opensea' }) {
    if (!tokenId || !nftAddress) { return null }
    const watchTokenUrl = this.defineWatchURL({ chainId, tokenId, nftAddress, src })
    const title = this.defineWatchTitle({ src })
    return <RoundedButton
      className={styles.button}
      target='_blank'
      href={watchTokenUrl}
    >
      {title}
    </RoundedButton>
  }

  defineWatchTitle ({ src }) {
    switch (src) {
      case 'opensea':
        return 'View token on OpenSea'
      case 'rarible':
        return 'View token on Rarible'
      default:
        return 'View token'
    }
  }

  defineWatchURL ({ chainId, tokenId, nftAddress, src = 'opensea' }) {
    const networkName = defineNetworkName({ chainId })
    if (src === 'opensea') {
      return this.defineOpenseaURL({ tokenId, nftAddress, networkName })
    } else if (src === 'rarible') {
      return this.defineRaribleURL({ tokenId, nftAddress, networkName })
    }
  }

  defineOpenseaURL ({ tokenId, nftAddress, networkName }) {
    if (networkName === 'mainnet') {
      return `https://opensea.io/assets/${nftAddress}/${tokenId}`
    }
    if (networkName === 'matic') {
      return `https://opensea.io/assets/matic/${nftAddress}/${tokenId}`
    }
    return `https://testnets.opensea.io/assets/${networkName}/${nftAddress}/${tokenId}`
  }

  defineRaribleURL ({ tokenId, nftAddress, networkName }) {
    if (networkName === 'mainnet') {
      return `https://rarible.com/token/${nftAddress}:${tokenId}`
    } else if (networkName === 'rinkeby') {
      return `https://rinkeby.rarible.com/token/${nftAddress}:${tokenId}`
    }
    return null
  }

  renderSubscribeForm ({ subscribe, email, loading, sendDataStatus, transactionId, wallet }) {
    if (subscribe && subscribe === 'false') { return null }
    return <div className={classNames(styles.form, {
      [styles.formLoading]: loading,
      [styles.formFinished]: sendDataStatus === 'success',
      [styles.formFailed]: sendDataStatus === 'failed',
      [styles.disableTranslateY]: !transactionId
    })}>
      <div className={classNames(styles.formOverlay, styles.formLoadingOverlay)} />
      <div className={classNames(styles.formOverlay, styles.formSuccessOverlay)}>{this.t('titles.subscribed')}</div>
      <div className={classNames(styles.formOverlay, styles.formFailedOverlay)}>{this.t('titles.failed')}</div>

      <RoundedButton
        onClick={_ => this.setState({ formShow: true })}
        className={styles.formOpenButton}
        inverted
      >
        {this.t('titles.formTitle')}
      </RoundedButton>



      <div className={styles.formContent}>
        <div className={styles.formInput}>
          <Input
            value={email}
            type='email'
            placeholder={this.t('titles.yourEmail')}
            className={styles.input}
            onChange={({ value }) => this.setState({ email: value })}
          />
          <div
            className={styles.formButton}
            onClick={_ => {
              this.actions().user.saveData({ email, account: wallet })
            }}
          >
            <Icons.ContinueArrow />
          </div>
        </div>
        <div className={styles.fakeCheckbox}>
          <img src={FakeCheckbox} /> {this.t('titles.fakeCheckbox')}
        </div>
      </div>
    </div>
  }
}

export default ClaimingFinishedPage
