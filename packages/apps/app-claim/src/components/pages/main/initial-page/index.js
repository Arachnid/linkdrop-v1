import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import { shortenString, getHashVariables } from '@linkdrop/commons'
import text from 'texts'
import classNames from 'classnames'
import { RoundedButton } from 'components/common'
import tokenImage from './token.jpeg'
import { mainTokenTitle } from 'app.config.js'

import styles from './styles.module'
import commonStyles from '../styles.module'
@actions(({}) => ({}))
@translate('pages.main')
class InitialPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  componentWillReceiveProps ({ icon }) {
    const { icon: prevIcon } = this.props
    const { iconType } = this.state
    if (prevIcon !== icon && icon != null && iconType !== 'default') {
      this.setState({
        iconType: 'default'
      })
    }
  }

  renderIcon () {
    return <img className={styles.gif} src={tokenImage} />
  }

  renderTitle ({ amount, symbol, wallet }) {
    const token = amount ? `${parseFloat(amount)} ${symbol}` : symbol
    if (!wallet) {
      return <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.claimWithNoWallet', {
            token
          })
        }}
      />
    }
    return <div
      className={styles.title}
      dangerouslySetInnerHTML={{
        __html: this.t('titles.claimWithWallet', {
          token,
          wallet: shortenString({ wallet })
        })
      }}
    />
  }

  render () {
    const { onClick, amount, symbol, loading, icon, wallet } = this.props
    const { nftAddress, variant } = getHashVariables()
    return <div className={commonStyles.container}>
      {this.renderIcon()}
      {this.renderTitle({ amount, symbol: mainTokenTitle, wallet })}
      <RoundedButton
        loading={loading}
        className={styles.button}
        onClick={_ => onClick && onClick()}
      >
        {text('common.buttons.claim')}
      </RoundedButton>
      <div
        className={styles.terms} dangerouslySetInnerHTML={{
          __html: this.t('titles.agreeWithTerms', {
            href: 'https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58'
          })
        }}
      />
      {false && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
      <div
        className={styles.checkLink}
        onClick={_ => {
          this.actions().user.setStep({
            step: 11
          })
        }}
      >
        {this.t('titles.checkIfEligible')}
      </div>
    </div>
  }
}

export default InitialPage
