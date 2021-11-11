import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { defineDefaultSymbol } from 'helpers'
import { ethers } from 'ethers'
import classNames from 'classnames'
import { Select, Input, PageHeader, PageLoader, Note } from 'components/common'
import config from 'config-dashboard'
import Immutable from 'immutable'
import wallets from 'wallets'
import { LinksContent, NextButton, AddEthField, EthTexts } from 'components/pages/common'

@actions(({
  user: {
    chainId,
    currentAddress,
    loading
  },
  campaigns: {
    items,
    proxyAddress
  },
  tokens: {
    assets,
    symbol,
    currentEthBalance,
    currentTokenBalance
  }
}) => ({
  assets,
  chainId,
  symbol,
  loading,
  proxyAddress,
  currentAddress,
  items,
  currentEthBalance,
  currentTokenBalance
}))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    const { assets, chainId } = this.props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
    this.TOKENS = [
      {
        label: `${this.defaultSymbol} — ${(ethers.constants.AddressZero).slice(0, 35)}...`,
        value: ethers.constants.AddressZero
      }
    ]
    this.WALLETS = this.createWalletOptions(chainId)
    const assetsPrepared = this.prepareAssets({ assets })
    this.state = {
      options: assetsPrepared,
      tokenAmount: '0',
      ethAmount: '0',
      linksAmount: '0',
      addEth: false,
      tokenAddress: ethers.constants.AddressZero,
      wallet: (this.WALLETS[0] || {}).value
    }
  }

  createWalletOptions (chainId) {
    return (['walletconnect', 'metamask', 'coinbase', 'imtoken', 'fortmatic', 'portis', 'opera'])
      .filter(wallet => (wallets[wallet].chains || []).find(v => v === String(chainId)))
      .map(wallet => {
      const label = wallets[wallet].name
      return {
        label: wallet === 'walletconnect' ? `Default: ${label}` : label,
        value: wallet
      }
    })
  }

  componentDidMount () {
    const { currentAddress, chainId, proxyAddress, items } = this.props
    this.actions().tokens.emptyTokenERC20Data()
    this.actions().tokens.emptyTokenERC721Data()

    if (!proxyAddress) {
      this.actions().campaigns.createProxyAddress({ campaignId: items.length })
    }
    this.actions().tokens.getAssets({ currentAddress })
  }

  componentWillReceiveProps ({ assets }) {
    const { assets: prevAssets } = this.props
    if (assets != null && assets.length > 0 && !Immutable.fromJS(assets).equals(Immutable.fromJS(prevAssets))) {
      const assetsPrepared = this.prepareAssets({ assets })
      this.setState({
        options: assetsPrepared
      })
    }
  }

  defineTokenSymbol ({ tokenAddress }) {
    const { assets, chainId } = this.props
    if (tokenAddress === ethers.constants.AddressZero) {
      return this.defaultSymbol
    }
    return (assets.find(item => item.address === tokenAddress) || {}).symbol
  }

  render () {
    const { ethAmount, linksAmount, tokenAmount, wallet, addEth, tokenAddress, options } = this.state
    const { symbol, loading, assets, currentEthBalance, currentTokenBalance, chainId, proxyAddress } = this.props
    const tokenSymbol = this.defineTokenSymbol({ tokenAddress })
    const tokenType = this.defineTokenType({ tokenAddress })
    console.log({ tokenType })
    return <div className={classNames(styles.container)}>
      {loading && <PageLoader />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <div
              className={styles.manualPage}
              dangerouslySetInnerHTML={{
                __html: this.t('titles.findToken', {
                  href: '/#/campaigns/create-erc20-manual'
                })
              }}
            />
            <Select
              options={options}
              value={tokenAddress}
              onChange={({ value }) => {
                this.setState({
                  tokenAddress: value
                }, () => {
                  if (value !== ethers.constants.AddressZero) {
                    this.actions().tokens.setTokenERC20Data({ tokenAddress: value })
                  } else {
                    this.actions().tokens.emptyTokenERC20Data()
                  }
                })
              }}
            />
            <div className={styles.currentBalance}>
              {currentTokenBalance !== null && tokenType === 'erc20' && <div>{this.t('titles.balance')} {currentTokenBalance} {tokenType === 'erc20' ? symbol : tokenSymbol}</div>}
              <div>{this.t('titles.balance')} {currentEthBalance} {this.defaultSymbol}</div>
            </div>
          </div>
          {this.renderTokenInputs({ ethAmount, tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, addEth })}
          <div className={styles.linksAmount}>
            <h3 className={styles.subtitle}>{this.t('titles.totalLinks')}</h3>
            <div className={styles.linksAmountContainer}>
              <Input numberInput decimalSeparator={false} className={styles.input} value={linksAmount} onChange={({ value }) => this.setField({ field: 'linksAmount', value: parseFloat(value) })} />
            </div>
          </div>
          {this.defaultSymbol !== 'xDAI' && <div className={styles.chooseWallet}>
            <h3 className={styles.subtitle}>{this.t('titles.receiverWallet')}</h3>
            <Select
              options={this.WALLETS}
              value={wallet}
              onChange={({ value }) => {
                this.setState({
                  wallet: value
                })
              }}
            />
          </div>}
        </div>

        <div className={styles.summary}>
          <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
          {this.renderTexts({
            tokenAddress,
            ethAmount,
            tokenType,
            linksAmount,
            tokenAmount,
            tokenSymbol: symbol || tokenSymbol,
            addEth
          })}
          {Number(chainId) === 1 && <Note aside text={this.t('texts.gasPriceAttention')} />}
        </div>
      </div>
      <NextButton
        tokenAmount={tokenAmount}
        ethAmount={ethAmount}
        linksAmount={linksAmount}
        tokenSymbol={symbol || tokenSymbol}
        tokenType={tokenType}
        wallet={wallet}
      />
    </div>
  }

  renderTokenInputs ({ tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, ethAmount, addEth }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    const fieldToChange = tokenType === 'erc20' ? 'tokenAmount' : 'ethAmount'
    const amountInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <Input
          disabled={tokenType === 'erc20' && !symbol && !tokenSymbol}
          numberInput
          suffix={tokenType === 'erc20' ? symbol : tokenSymbol}
          className={styles.input}
          value={value}
          onChange={({ value }) => this.setField({ field: fieldToChange, value: parseFloat(value) })}
        />
        <AddEthField
          tokenType={tokenType}
          addEth={addEth}
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
    return <div>
      {amountInput}
    </div>
  }

  prepareAssets ({ assets }) {
    console.log({ assets })
    const formattedAssets = assets.map(({ address, symbol }) => ({
      label: `${symbol} — ${(address)}`,
      value: address
    }))
    return [this.TOKENS[0]].concat(formattedAssets)
  }

  defineTokenType ({ tokenAddress }) {
    if (tokenAddress === ethers.constants.AddressZero) {
      return 'eth'
    }
    return 'erc20'
  }

  renderTexts ({ ethAmount, tokenAddress, linksAmount, tokenAmount, tokenSymbol, addEth, tokenType }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    if (tokenType === 'erc20') {
      if (!linksAmount || !value) {
        return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.fillTheField')}</p>
      }
    }
    if (tokenType === 'eth') {
      if (!linksAmount || Number(linksAmount) === 0 || !value || Number(value) === 0) {
        return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.fillTheField')}</p>
      }
    }
    return <div>
      {tokenType === 'erc20' && <p className={classNames(styles.text, styles.textMargin15)}>{value * linksAmount} {tokenSymbol}</p>}
      <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} />
      <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType={tokenType} />
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFee', { symbol: this.defaultSymbol, price: config.linkPrice * linksAmount }) }} />
      <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeePerLink', { symbol: this.defaultSymbol, price: config.linkPrice }) }} />
    </div>
  }

  setField ({ value, field }) {
    if (field === 'ethAmount' || field === 'tokenAmount') {
      return this.setState({
        [field]: value
      })
    }
    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenAddress') {
        this.setState({
          ethAmount: 0,
          addEth: false
        })
      }
    })
  }
}

export default Step1
