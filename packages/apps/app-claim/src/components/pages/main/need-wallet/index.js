import React from 'react'
import { Alert, Icons, RetinaImage, Loading } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import classNames from 'classnames'
import { getImages, capitalize } from 'helpers'
import connectors from 'components/application/connectors'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { RoundedButton } from 'components/common'

@translate('pages.needWallet')
class NeewWallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render () {
    const { context } = this.props
    const { loading } = this.state
    return <div className={commonStyles.container}>
      {loading && <Loading withOverlay />}
      <Alert className={styles.alert} icon={<Icons.Exclamation />} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.main') }} />
      <div className={styles.content}>
        {this.renderButton({ connector: 'walletconnect', context })}
        <RoundedButton
          className={classNames(styles.button, styles.buttonIconed)}
          href='https://metamask.io/'
          target='_blank'
        >
          <RetinaImage width={20} {...getImages({ src: 'metamask-icon' })} />
          <div className={styles.buttonTitle}>
            {this.t(`buttons.metamask`)}
          </div>
        </RoundedButton>
        <div className={styles.instructions}>
          <div dangerouslySetInnerHTML={{ __html: this.t('texts._1') }} />
          <div dangerouslySetInnerHTML={{ __html: this.t('texts._2') }} />
        </div>
      </div>
    </div>
  }

  renderButton ({ connector, context }) {
    return <RoundedButton
      className={classNames(styles.button, styles.buttonIconed)}
      onClick={_ => {
        this.setState({
          loading: true
        }, _ => {
          context.activate(connectors[capitalize({ string: connector })])
        })
      }}
    >
      <RetinaImage width={20} {...getImages({ src: `${connector}-icon` })} />
      <div className={styles.buttonTitle}>{this.t(`buttons.${connector}`)}</div>
    </RoundedButton>
  }
}

export default NeewWallet
