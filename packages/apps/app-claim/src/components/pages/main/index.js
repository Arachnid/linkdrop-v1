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
import chains from 'chains'

import { getHashVariables, defineNetworkName, capitalize } from '@linkdrop/commons'

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
@translate('pages.claim')
class Claim extends React.Component {
constructor (props) {
    super(props)
    const { context } = props
    const { library } = context
    this.state = {
      connectorChainId: context.chainId,
      welcomeScreen: true,
      provider: library
    }
  }

  async componentDidMount () {
    const {
      linkKey,
      chainId,
      linkdropMasterAddress,
      campaignId
    } = getHashVariables()
    const { provider } = this.state
    this.actions().tokens.checkIfClaimed({ linkKey, chainId, linkdropMasterAddress, campaignId })
    this.actions().user.createSdk({ provider, linkdropMasterAddress, chainId, linkKey, campaignId })
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed, context, step }) {
    const { readyToClaim: prevReadyToClaim, context: prevContext } = this.props
    const { connectorChainId } = this.state

    if (context.library && !prevContext.library) {
      this.actions().user.setProvider({ provider: context.library })
    }

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
    const {
      tokenAddress,
      weiAmount,
      tokenAmount,
      expirationTime,
      chainId,
      nftAddress,
      tokenId,
      name,
      linkdropMasterAddress
    } = getHashVariables()
    if (Number(expirationTime) < (+(new Date()) / 1000)) {
      // show error page if link expired
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }

    if (nftAddress && tokenId) {
      if (tokenAmount) {
        return this.actions().contract.getTokenERC1155Data({
          nftAddress,
          tokenId,
          chainId,
          name,
          masterAddress: linkdropMasterAddress
        })
      }
      return this.actions().contract.getTokenERC721Data({ nftAddress, tokenId, chainId, name })
    }
    this.actions().contract.getTokenERC20Data({ tokenAddress, weiAmount, tokenAmount, chainId })
  }

  render () {
    const { context } = this.props
    return this.renderCurrentPage({ context })
  }

  async getProviderData ({ currentProvider }) {
    const accounts = await currentProvider.eth.getAccounts()
    const connectorChainId = await currentProvider.eth.getChainId()
    return { accounts, connectorChainId }
  }

  renderCurrentPage ({ context }) {
    const {
      variant,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      nftAddress,
      tokenId,
      weiAmount,
      chainId,
      campaignId,
      manual
    } = getHashVariables()
    const { decimals, amount, symbol, icon, step, userLoading, errors, alreadyClaimed, readyToClaim } = this.props
    const { connectorChainId, welcomeScreen } = this.state
    const {
      account
    } = context

    if (!readyToClaim) { return <Loading /> }
    const commonData = { linkdropMasterAddress, chainId, decimals, amount, symbol, icon, wallet: account, loading: userLoading }
    // if (this.platform === 'desktop' && chainId && !account) {
    //   return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    // }

    if (alreadyClaimed) {
      // if tokens we already claimed (if wallet is totally empty).
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

    if (this.platform === 'desktop' && !account) {
      return <NeedWallet context={context} />
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


    if (variant && welcomeScreen) {
      return <WelcomeScreenPage
        icon={icon}
        onClick={_ => {
          this.setState({
            welcomeScreen: false
          })
        }}
      />
    }



    switch (step) {
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => {
            if (!account) {
              return this.actions().user.setStep({ step: 2 })
            }
            if (Number(chainId) !== Number(connectorChainId) && Object.keys(chains).includes(String(chainId))) {
              return this.actions().user.setStep({ step: 6 })
            }
              // if wallet account was found in web3 context, then go to step 4 and claim data
            if (nftAddress && tokenId) {
              if (tokenAmount) {
                if (manual) {
                  return this.actions().tokens.claimTokensERC1155Manual({ linkdropMasterAddress, wallet: account, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, tokenAmount })
                }
                return this.actions().tokens.claimTokensERC1155({ wallet: account, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature, tokenAmount })
              }
              if (manual) {
                return this.actions().tokens.claimTokensERC721Manual({ linkdropMasterAddress, wallet: account, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature })
              }
              return this.actions().tokens.claimTokensERC721({ wallet: account, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature })
            }

            if (manual) {
              return this.actions().tokens.claimTokensERC20Manual({ campaignId, wallet: account, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature })
            }

            return this.actions().tokens.claimTokensERC20({ campaignId, wallet: account, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature })  

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
            return this.actions().user.setStep({ step: 4 })
          }}
        />
      case 4:
        return <ClaimingProcessPage
          {...commonData}
        />
      case 5:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
        />
      case 6:
        return <ConnectToChainPage
          chainToConnectTo={chainId}
          wallet={account}
          context={context}
        /> 
      default:
        // зloading
        return <Loading />
    }
  }
}

export default Claim
