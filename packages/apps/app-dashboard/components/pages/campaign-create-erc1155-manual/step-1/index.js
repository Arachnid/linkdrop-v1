import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { getHashVariables, convertFromExponents } from '@linkdrop/commons'
import {
  Select,
  PageHeader,
  Input,
  PageLoader,
  NFTToken,
  Note,
  Button
} from 'components/common'
import {
  TokenAddressInput,
  LinksContent,
  NextButton,
  AddEthField,
  EthTexts,
  TokenIdInput,
  
} from 'components/pages/common'

import config from 'config-dashboard'
import AllTokensControl from './all-tokens-control'
import Immutable from 'immutable'
import { defineDefaultSymbol } from 'helpers'
import wallets from 'wallets'

const WALLET_IDS = ['walletconnect', 'metamask', 'coinbase', 'imtoken', 'fortmatic', 'portis', 'opera']

@actions(({
  user: {
    chainId,
    loading
  },
  campaigns: {
    items,
    proxyAddress
  },
  tokens: {
    erc1155SingleAsset,
    loading: tokensLoading
  }
}) => ({
  chainId,
  loading,
  proxyAddress,
  items,
  erc1155SingleAsset,
  tokensLoading
}))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = this.props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
    this.WALLETS = this.createWalletOptions()    
    let { wallet = WALLET_IDS[0] } = getHashVariables()

    wallet = WALLET_IDS.find(w => w === wallet) || WALLET_IDS[0]
    
    this.state = {
      ethAmount: 0,
      tokenId: null,
      tokenAddress: null, // currentAsset && currentAsset.address,
      currentIds: [], // currentAsset ? currentAsset.ids : [],
      addEth: false,
      wallet,
      linksAmount: []
    }
  }

  createWalletOptions () {
    return WALLET_IDS.map(wallet => {
      const label = wallets[wallet].name
      return {
        label: wallet === WALLET_IDS[0] ? `Default: ${label}` : label,
        value: wallet
      }
    })
  }

  componentDidMount () {
    const { proxyAddress, items } = this.props
    this.actions().tokens.emptyTokenERC20Data()
    this.actions().tokens.emptyTokenERC1155Data()
    if (!proxyAddress) {
      this.actions().campaigns.createProxyAddress({ campaignId: items.length })
    }
  }

  componentWillReceiveProps ({ erc1155SingleAsset }) {
    const { erc1155SingleAsset: prevAsset } = this.props
    if (
      !erc1155SingleAsset || !prevAsset 
    ) {
      return
    }

    if (prevAsset.ids.length === erc1155SingleAsset.ids.length) {
      return
    }

    if (erc1155SingleAsset.ids.length === 0) {
      return
    }

    this.setState({
      currentIds: erc1155SingleAsset.ids
    })
  }

  render () {
    const { currentIds, ethAmount, addEth, tokenAddress, wallet, tokenId, linksAmount  } = this.state
    const linksCount = linksAmount.length

    const { loading, tokensLoading, erc1155SingleAsset, chainId } = this.props
    return <div className={styles.container}>
      {(tokensLoading || loading) && <PageLoader />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <h3 className={styles.subtitle}>
            <span>{this.t('titles.contractAddress')}</span>
          </h3>
          {this.renderTokenInputs({ tokenId, addEth, ethAmount, tokenAddress, erc1155SingleAsset, linksAmount })}
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
            tokenType: 'erc1155',
            linksAmount: linksCount,
            tokenAmount: currentIds.length ? 1 : 0,
            tokenSymbol: erc1155SingleAsset && erc1155SingleAsset.names && erc1155SingleAsset.names[currentIds[0]] || erc1155SingleAsset && erc1155SingleAsset.symbol || '',
            addEth
          })}
          {Number(chainId) === 1 && <Note aside text={this.t('texts.gasPriceAttention')} />}
        </div>
      </div>

      <div>
        <h3 className={styles.subtitle}>{this.t('titles.selectNft')}</h3>
        {this.renderAllTokensControls({ asset: erc1155SingleAsset, currentIds })}
        {this.renderNFTTokens({
          currentAsset: erc1155SingleAsset,
          currentIds
        })}
      </div>


      <NextButton
        tokenAmount={1}
        ethAmount={ethAmount}
        linksAmount={linksAmount} 
        wallet={wallet}
        tokenSymbol={erc1155SingleAsset && erc1155SingleAsset.names && erc1155SingleAsset.names[currentIds[0]] || erc1155SingleAsset && erc1155SingleAsset.symbol || ''}
        tokenType='erc1155'
        tokenIds={currentIds}
      />
    </div>
  }

  renderAllTokensControls ({ asset, currentIds }) {
    if (!asset) { return null }
    return <div>
      <AllTokensControl
        title={this.t(`buttons.${currentIds.length === asset.ids.length ? 'deselectAll' : 'selectAll'}`)}
        onClick={_ => {
          this.setState({
            currentIds: currentIds.length !== asset.ids.length ? asset.ids : []
          })
        }}
      />
    </div>
  }

  renderNFTTokens ({ currentAsset, currentIds }) {
    if (!currentAsset) { return }
    return <div className={styles.tokens}>
      {currentAsset.ids.map(id => <NFTToken
        key={`${currentAsset.address}_${id}`}
        {...currentAsset}
        id={id}
        onSelect={({ selected }) => this.onSelect({ selected, id })}
        selected={currentIds.indexOf(id) > -1}
      />)}
    </div>
  }

  // {currentAsset.ids.map(id => <NFTToken
  //   key={`${currentAsset.address}_${id}`}
  //   {...currentAsset}
  //   id={id}
  //   onSelect={({ selected }) => this.onSelect({ selected, id })}
  //   selected={currentIds.indexOf(id) > -1}
  // />)}

  onSelect ({ selected, id }) {
    const { currentIds } = this.state
    const currentIdsUpdated = selected ? currentIds.concat(id) : currentIds.filter(item => item !== id)
    this.setState({
      currentIds: currentIdsUpdated
    })
  }

  renderTokenInputs ({ tokenId, addEth, ethAmount, tokenAddress, erc1155SingleAsset, linksAmount }) {
    const ethInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.ethInLink', { symbol: this.defaultSymbol })}</h3>
      <div className={styles.tokensAmountContainer}>
        <AddEthField
          addEth={addEth}
          noMargin
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
    const tokenIdInput = this.tokenIdsInput({ erc1155SingleAsset, linksAmount })
    return <div>
      <TokenAddressInput
        tokenAddress={tokenAddress}
        tokenType='erc1155'
        className={styles.tokenAddress}
        setField={({ value, field }) => this.setField({ value, field })}
      />
      {tokenIdInput}
      {ethInput}
    </div>
  }

  tokenIdsInput ({ erc1155SingleAsset, linksAmount }) {
    if (!erc1155SingleAsset) { return null }
    const tokenIds = Object.entries(linksAmount.reduce((sum, item) => {
      sum[item] = (sum[item] || 0) + 1
      return sum
    }, {})).map(item => `${item[0]} (links amount: ${item[1]})`)

    return <div className={styles.tokenIdInput}>
      <TokenIdInput
        tokenIds={tokenIds}
        title={'ID / amount'}
        addToken={({ tokenId }) => {
          const [ currentTokenId, currentLinksAmount ] = tokenId.split('/').map(item => item.trim())
          this.actions().tokens.getERC1155SingleAssetToken({
            tokenId: currentTokenId, linksAmount: currentLinksAmount, callback: () => {
              this.setField({
               field: 'linksAmount',
               value: [
                ...linksAmount,
                ...new Array(Number(currentLinksAmount)).fill(currentTokenId)
              ]
             })
            }
          })
        }}
      />
    </div>
  }

  renderTexts ({ ethAmount, linksAmount, tokenAddress, tokenAmount, tokenSymbol }) {
    if (!linksAmount || !tokenAddress) {
      return <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.fillTheField')}</p>
    }
    return <div>
      <p className={classNames(styles.text, styles.textMargin15)}>{linksAmount} {tokenSymbol}</p>
      <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} />
      <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType='erc1155' />
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFee', { symbol: this.defaultSymbol, price: convertFromExponents(config.linkPrice * linksAmount) }) }} />
      <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeePerLink', { symbol: this.defaultSymbol, price: convertFromExponents(config.linkPrice) }) }} />
    </div>
  }

  setField ({ value, field }) {

    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenAddress') {
        this.setState({
          ethAmount: 0,
          addEth: false,
          currentIds: []
        }, _ => {
          if (value.length === 42) {
            this
              .actions()
              .tokens
              .getERC1155SingleAsset({
                address: value
              })
          } else {
            this.actions().tokens.emptyTokenERC1155Data()
          }
        })
      }
    })
  }
}

export default Step1
