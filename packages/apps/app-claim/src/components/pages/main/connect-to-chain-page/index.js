import React from 'react'
import { translate, actions } from 'decorators'
import { Button, RetinaImage } from '@linkdrop/ui-kit'
import chains from 'chains'
import cn from 'classnames'
import { shortenString } from '@linkdrop/commons'
import { getImages } from 'helpers'

import styles from './styles.module'
import commonStyles from '../styles.module'
@actions(({}) => ({}))
@translate('pages.main')
class ConnectToChainPage extends React.Component {
  render () {
    const { chainToConnectTo, currentChainId, context, wallet } = this.props
    const { chainName } = chains[chainToConnectTo]

    return <div className={cn(commonStyles.container, styles.container)}>
      <RetinaImage
        width={100}
        className={styles.image}
        {...getImages({ src: 'polygon' })}
      />

      <h2 className={styles.title}>{this.t('titles.addCustomNetwork', {
        chainName
      })}</h2>
      <div className={styles.text}>{this.t('titles.addCustomNetworkText')}</div>
      <Button
        onClick={_ => this.actions().metamask.setChain({
          chainIdToSet: chainToConnectTo,
          currentChainId,
          connector: context.connector
        })}
        className={styles.button}
      >
        {this.t(`buttons.addNetwork`, {
          chainName
        })}
      </Button>
      {wallet && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
    </div>
  }
}

export default ConnectToChainPage
