import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { shortenString, getHashVariables } from '@linkdrop/commons'
import text from 'texts'
import classNames from 'classnames'
import { RoundedButton } from 'components/common'

import styles from './styles.module'
import commonStyles from '../styles.module'
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

  renderIcon ({ icon, nftAddress, symbol }) {
    const { iconType } = this.state
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />
    return <Alert
      noBorder={iconType === 'default' && symbol !== 'ETH' && symbol !== 'xDAI'}
      className={classNames(styles.tokenIcon, {
        [styles.tokenIconNft]: nftAddress && iconType === 'default'
      })}
      icon={finalIcon}
    />
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
    const { nftAddress } = getHashVariables()
    return <div className={commonStyles.container}>
      {this.renderIcon({ nftAddress, symbol, icon })}
      {this.renderTitle({ amount, symbol, wallet })}
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
    </div>
  }
}

export default InitialPage
