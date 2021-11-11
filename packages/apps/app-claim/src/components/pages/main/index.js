import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform, detectBrowser } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import NeedWallet from './need-wallet'
import WelcomeScreenPage from './welcome-screen-page'
import ConnectToChainPage from './connect-to-chain-page'
import Tweet from './tweet'
import CheckTweet from './check-tweet'
import TokenCheckPage from './token-check-page'
import TokenFound from './token-found'
import VerifyEligibility from './verify-eligibility'
import EligibilityVerified from './eligibility-verified'
import CampaignOverPage from './campaign-over-page'
import chains from 'chains'
import { defaultChainId } from 'app.config.js'

import { terminalApiKey, terminalProjectId } from 'app.config.js'
import { getHashVariables, defineNetworkName, capitalize } from '@linkdrop/commons'
import Web3 from 'web3'
import { TerminalHttpProvider, SourceType } from '@terminal-packages/sdk'

@actions(({ user: { errors, step, loading: userLoading, readyToClaim, alreadyClaimed }, tokens: { transactionId }, contract: { loading, decimals, amount, symbol, icon } }) => ({
  userLoading,
  loading,
  decimals,
  symbol,
  amount,
  icon,
  step,
  transactionId,
  errors,
  alreadyClaimed,
  readyToClaim
}))
@platform()
@detectBrowser()
@translate('pages.main')
class Claim extends React.Component {
  constructor (props) {
    super(props)
    const { web3Provider, context } = props
    const currentProvider = web3Provider && this.createTerminalProvider({ web3Provider })
    
    this.state = {
      // accounts: null,
      connectorChainId: context.chainId,
      currentProvider,
      welcomeScreen: true
    }
  }

  createTerminalProvider ({ web3Provider }) {
    return web3Provider
    // return new Web3(web3Provider)
    // const web3 = new Web3(
    //   new TerminalHttpProvider({
    //     apiKey: terminalApiKey,
    //     projectId: terminalProjectId,
    //     source: SourceType.Terminal,
    //     customHttpProvider: web3Provider
    //   })
    // );
  }

  componentDidMount () {
    this.actions().user.getCampaignData()
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed, context, step }) {
    const { readyToClaim: prevReadyToClaim, context: prevContext } = this.props
    const { connectorChainId } = this.state

    if (context &&
      context.error &&
      context.error.message &&
      context.error.message.includes('Unsupported chain id')  &&
      !prevContext.error.message.includes('Unsupported chain id')
    ) {
      return this.actions().user.setErrors({ errors: ['CONNECTOR_NETWORK_NOT_SUPPORTED'] })
    }
    if (context.chainId && connectorChainId !== context.chainId) {
      this.setState({
        connectorChainId: context.chainId
      })
    }
    if (context &&
      context.account &&
      !prevContext.account
    ) {
      return this.actions().user.setStep({ step: 1 })
    }
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) {
      if (step === 2) {
        if (context.active && context.account && !prevContext.account && !prevContext.active) {
          this.actions().user.setStep({ step: 1 })
        }
      }
      return
    }
    // if (Number(expirationTime) < (+(new Date()) / 1000)) {
    //   // show error page if link expired
    //   return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    // }

    // if (nftAddress && tokenId) {
    //   return this.actions().contract.getTokenERC721Data({ nftAddress, tokenId, chainId, name })
    // }
    // this.actions().contract.getTokenERC20Data({ tokenAddress, weiAmount, tokenAmount, chainId })
  }

  render () {
    const { context } = this.props
    return this.renderCurrentPage({ context })
  }

  // async getProviderData ({ currentProvider }) {
  //   const accounts = await currentProvider.eth.getAccounts()
  //   const connectorChainId = await currentProvider.eth.getChainId()
  //   return { accounts, connectorChainId }
  // }

  renderCurrentPage ({ context }) {
    const { decimals, amount, symbol, icon, step, userLoading, errors, alreadyClaimed, web3Provider, readyToClaim } = this.props

    const { connectorChainId, welcomeScreen } = this.state
    const {
      account
    } = context

    // !!!!!!!!! if (!readyToClaim) { return <Loading /> }
    // when token data is not ready



    const chainId = defaultChainId


    const commonData = { chainId, decimals, amount, symbol, icon, wallet: account, context, loading: userLoading }
    // if (this.platform === 'desktop' && chainId && !account) {
    //   return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    // }

    if (alreadyClaimed) {
      // if tokens were already claimed
      return <ClaimingFinishedPage
        {...commonData}
      />
    }

    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage
        error={errors[0]}
        network={capitalize({ string: defineNetworkName({ chainId }) })}
      />
    }


    if (
      ((this.platform === 'desktop' && connectorChainId && Number(chainId) !== Number(connectorChainId)) ||
      (this.platform !== 'desktop' && account && connectorChainId && Number(chainId) !== Number(connectorChainId))) &&
      !Object.keys(chains).includes(String(chainId))
    ) {
      // if you use desktop browser and the network id in the link and in the web3 object are different
      // or if you use mobile broswer, and you have account, and the network id in the link and in the web3 object are different
      
      return <ErrorPage
        error='NETWORK_NOT_SUPPORTED'
        network={capitalize({ string: defineNetworkName({ chainId }) })}
      />
    }

    
    const hasNoNeededChain = Number(chainId) !== Number(connectorChainId) && Object.keys(chains).includes(String(chainId))
    console.log({ hasNoNeededChain })
    switch (step) {
      case 1:
        return <InitialPage
            {...commonData}
            onClick={_ => {
              if (account) {
                // if wallet account was found in web3 context, then go to step 4 and claim data
                if (hasNoNeededChain) {
                  // go to chain connect
                  return this.actions().user.setStep({ step: 4 })
                } else {
                  // go to check token screen
                  return this.actions().user.setStep({ step: 5 })
                }
              }
              if (this.platform === 'desktop') {
                // if you use desktop browser and has no account, so you need web3
                return this.actions().user.setStep({ step: 13 })
              }
              // if wallet was not found in web3 context, then go to step 2 with wallet select page and instructions
              this.actions().user.setStep({ step: 2 })
            }}
          />
      case 2:
        // page with wallet select component
        return <WalletChoosePage
          context={context}
          onClick={_ => {
            this.actions().user.setStep({ step: 3 })
          }}
        />
      case 3:
        // page with info about current wallet and button to claim tokens
        return <InitialPage
          {...commonData}
          onClick={_ => {
            if (hasNoNeededChain) {
              // go to chain connect
              return this.actions().user.setStep({ step: 4 })
            } else {
              // go to check token screen
              return this.actions().user.setStep({ step: 5 })
            }
          }}
        />
      case 4:
        //connect to chain
        return <ConnectToChainPage
          chainToConnectTo={chainId}
          wallet={account}
          context={context}
        />

      case 5:
        // checking token
        return <TokenCheckPage
          wallet={account}
          chainId={chainId}
        />

      case 6:
        // tweeter screen
        return <Tweet
          {...commonData}
          onClick={_ => {
            return this.actions().user.setStep({ step: 7 })
          }}
        />

      case 7:
        // check tweet screen
        return <CheckTweet
          {...commonData}
        />

      case 8:
        // "you are in" screen
        return <TokenFound
          wallet={account}
          chainId={chainId}
        />
        

      case 9:
        return <ClaimingProcessPage
          {...commonData}
        />

      case 10:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
        />

      case 11:
        // check Eligibility
        return <VerifyEligibility />

      case 12:
        // checked
        return <EligibilityVerified />

      case 13:
        // checked
        return <NeedWallet context={context} />

      case 14:
        // checked
        return <ClaimingFinishedPage
          {...commonData}
          title={this.t('titles.alreadyClaimed')}
        />

      case 15:
        // checked
        return <CampaignOverPage
          {...commonData}
        />

      default:
        // зloading
        return <Loading />
    }
  }
}

export default Claim
