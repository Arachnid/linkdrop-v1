import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import { actions, translate } from 'decorators'
import { Textarea } from 'components/common'
import { shortenString } from '@linkdrop/commons'
import styles from './styles.module.scss'
import cn from 'classnames'
import commonStyles from '../styles.module'
import icon from './icon.png'

@actions(({
  user: {
    localErrors
  }
}) => ({
  localErrors
}))
@translate('pages.main')
class TokenFound extends React.Component {
  componentDidMount () {
    gtag('event', 'user_has_token', {
      'event_label': 'User has token',
      'event_category': 'user_has_token'
    });
  }

  render () {
    let { chainId, wallet, localErrors } = this.props
    return <div className={commonStyles.container}>
      <img src={icon} className={styles.icon} />
      <h2 className={styles.title}>
        {this.t('titles.tokenFoundTitle')}
      </h2>

      <div className={styles.description}>
        {this.t('titles.tokenFoundSubtitle')}
      </div>
      <Button
        onClick={() => {
          this.actions().tokens.claimToken({ chainId, wallet })
        }}
        className={styles.button}
      >
        {this.t('buttons.claim')}
      </Button>
      {wallet && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
      {localErrors && localErrors.length > 0 && <div className={styles.errors}>{localErrors.join(',')}</div>}
    </div>
  }
}


export default TokenFound
