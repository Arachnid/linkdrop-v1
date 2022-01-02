import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button, PageHeader, PageLoader, Instruction } from 'components/common'
import config from 'config-dashboard'
import { multiply, add, bignumber, subtract } from 'mathjs'
import EthSummaryBlock from './eth-summary-block'
import { defineDefaultSymbol } from 'helpers'
import { linksLimit } from 'app.config.js'
import { convertFromExponents } from '@linkdrop/commons'
import { Checkbox } from '@linkdrop/ui-kit'

@actions(({
  user: {
    loading,
    currentAddress,
    errors,
    chainId
  },
  tokens: {
    ethBalanceFormatted,
    erc20BalanceFormatted,
    address
  },
  metamask: {
    status: metamaskStatus
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    proxyAddress,
    linksAmount,
    tokenType,
    tokenSymbol,
    sponsored
  }
}) => ({
  ethAmount,
  tokenAmount,
  metamaskStatus,
  linksAmount,
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  chainId,
  address,
  proxyAddress,
  tokenType,
  ethBalanceFormatted,
  erc20BalanceFormatted,
  sponsored
})
)
@translate('pages.campaignCreate')
class Step3 extends React.Component {
  constructor (props) {
    super(props)
    const { chainId, sponsored } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
    this.state = {
      loading: false,
      sponsored
    }
  }

  componentWillReceiveProps ({ linksAmount, tokenType, metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      proxyAddress,
      ethBalanceFormatted: prevEthBalanceFormatted,
      chainId
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      return this.setState({
        loading: true
      }, _ => {
        this.intervalEthCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), config.balanceCheckInterval)
      })
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
      })
    }

    if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
        // if links amount >= 1000 -> go to script page
        const totalLinks = tokenType === 'erc1155' ? linksAmount.length : linksAmount
        if (totalLinks >= linksLimit) {
          return window.setTimeout(_ => this.actions().campaigns.save({ links: [] }), config.nextStepTimeout)
        }
        window.setTimeout(_ => this.actions().user.setStep({ step: 4 }), config.nextStepTimeout)
      })
    }
  }

  render () {
    const { loading: stateLoading, sponsored } = this.state
    const { linksAmount, ethAmount, tokenType, chainId, currentAddress, loading } = this.props
    const totalLinks = tokenType === 'erc1155' ? linksAmount.length : linksAmount
    const ethAmountFinal = convertFromExponents(multiply(add(bignumber(ethAmount), bignumber(config.linkPrice), sponsored ? bignumber(0.02) : 0), totalLinks))
    const serviceFee = convertFromExponents(multiply(add(bignumber(config.linkPrice), sponsored ? bignumber(0.02) : 0), bignumber(totalLinks)))

    return <div className={styles.container}>
      {(loading || stateLoading) && <PageLoader transaction={stateLoading} />}
      <PageHeader title={this.t('titles.sendEth', { symbol: this.defaultSymbol, ethAmount: ethAmountFinal })} />
      <div className={styles.main}>
        <div className={styles.description}>
          <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts._10', { defaultSymbol: this.defaultSymbol }) }} />
          <h3 className={styles.dataTitle}>
            Sponsor claim transactions
          </h3>
          <Checkbox
            title={totalLinks > 1 ? `0.02 ${this.defaultSymbol} * ${totalLinks} claims (=${convertFromExponents(multiply(totalLinks, 0.02))} ${this.defaultSymbol})` : `0.02 ${this.defaultSymbol}`}
            checked={sponsored}
            className={styles.checkbox}
            onChange={({ value }) => {
              this.setState({ sponsored: value })
            }}
          />
          <div className={styles.dataContent}>
            Sponsor claim transactions so that recipients can claim tokens without having {this.defaultSymbol} in their wallets. Claim transactions are sponosored when gas price is up to 150 GWEI maximum. Alternatively, the recipients must pay for the gas themselves.
          </div>
        </div>
        <div className={styles.scheme}>
          <Instruction linksAmount={totalLinks} ethAmount={ethAmount} />
        </div>
      </div>
      <EthSummaryBlock
        symbol={this.defaultSymbol}
        ethTotal={ethAmountFinal}
        ethToDistribute={subtract(bignumber(ethAmountFinal), bignumber(serviceFee))}
        serviceFee={serviceFee}
        text={this.t}
      />
      <div className={styles.controls}>
        <Button
          disabled={loading || stateLoading}
          className={styles.button}
          onClick={_ => {
            this.actions().metamask.sendEth({
              ethAmount: ethAmountFinal,
              account: currentAddress,
              chainId,
              sponsored
            })
          }}
        >
          {this.t('buttons.send')}
        </Button>
      </div>
    </div>
  }
}

export default Step3
