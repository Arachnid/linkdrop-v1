import React from 'react'
import { RetinaImage } from '@linkdrop/ui-kit'
import { translate, actions, platform } from 'decorators'
import { getImages, getWalletLink, getWalletData, capitalize } from 'helpers'
import { copyToClipboard } from '@linkdrop/commons'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'
import Slider from './slider'
import CommonInstruction from './common-instruction'
import DeepLinkInstruction from './deep-link-instruction'
import connectors from 'components/application/connectors'
import { RoundedButton } from 'components/common'

@actions(({ user: { walletType } }) => ({ walletType }))
@translate('pages.main')
@platform()
class WalletChoosePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showSlider: null,
      loading: false
    }
  }

  render () {
    const { showSlider, loading } = this.state
    const { walletType, context, chainId } = this.props
    const { platform } = this
    const w = 'metamask'
    const addSlider = Number(chainId) !== 100
    if (walletType && walletType != null) {
      return this.renderWalletInstruction({ walletType })
    } else {
      const button = this.defineButton({ chainId, platform, w, context, loading })
      const { name: walletTitle } = getWalletData({ wallet: w })
      return <div className={classNames(commonStyles.container, styles.container, {
        [styles.sliderShow]: showSlider,
        [styles.sliderHide]: showSlider === false
      })}
      >
        <div className={classNames(styles.wallet, styles.withBorder, styles.walletPreview)}>
          {this.renderIcon({ id: w })}
        </div>
        <div className={styles.title} dangerouslySetInnerHTML={{__html: this.t(`titles.connectWallet`, { connector: walletTitle })}}/>
        {button}
        {addSlider && this.renderSlider({ walletType })}
      </div>
    }
  }

  defineButton ({ platform, w, context, loading, chainId }) {
    if (platform === 'desktop') { return null }

    if (w !== 'walletconnect') {
      const buttonTitle = getWalletData({ wallet: w }).name
      const buttonLink = getWalletLink({ platform, wallet: w, currentUrl: window.location.href })
      return <RoundedButton href={buttonLink} target='_blank' className={styles.button}>
        {this.t('buttons.useWallet', { wallet: buttonTitle })}
      </RoundedButton>
    }
    return this.renderConnectorButton({ context, loading, connector: capitalize({ string: w }) })
  }

  renderIcon ({ id }) {
    let imageId = id
    if (id === 'opera') {
      if (this.platform === 'ios') {
        imageId = 'opera-touch'
      }
    }
    return <RetinaImage width={60} {...getImages({ src: imageId })} />
  }

  defineWalletHref ({ walletURL, walletURLIos, walletType }) {
    if (walletType === 'opera') {
      if (this.platform === 'ios') {
        return walletURLIos
      }
    }
    return walletURL
  }

  renderWalletInstruction ({ walletType }) {
    const { showSlider } = this.state
    const { name: walletTitle, walletURL, walletURLIos } = getWalletData({ wallet: walletType })
    const title = <div className={styles.title} dangerouslySetInnerHTML={{__html: this.t(`titles.connectWallet`, { connector: walletTitle })}}/>
    return <div className={classNames(commonStyles.container, styles.container, {
      [styles.sliderShow]: showSlider,
      [styles.sliderHide]: showSlider === false
    })}
    >
      <div className={classNames(styles.wallet, styles.withBorder, styles.walletPreview)}>
        {this.renderIcon({ id: walletType })}
      </div>
      {title}
      {this.renderInstructionButton({ walletType })}
      {this.renderSlider({ walletType })}
    </div>
  }

  renderInstructionButton ({ walletType }) {
    const { context, chainId } = this.props
    const { loading } = this.state
    const { platform } = this
    switch (walletType) {
      case 'walletconnect':
        return this.renderConnectorButton({ context, loading, connector: capitalize({ string: walletType }) })
      case 'metamask':
        const buttonLink = getWalletLink({ platform, wallet: walletType, currentUrl: window.location.href })
        return <RoundedButton href={platform !== 'desktop' && buttonLink} className={styles.button}>
          {this.t('buttons.connect')}
        </RoundedButton>
      default:
        return <RoundedButton inverted onClick={_ => copyToClipboard({ value: window.location.href })} className={styles.button}>
          {this.t('buttons.copyLink')}
        </RoundedButton>
    }
  }

  renderConnectorButton ({ context, connector, loading }) {
    return <RoundedButton
      className={styles.button}
      loading={loading}
      onClick={_ => {
        this.setState({
          loading: true
        }, _ => {
          context.activate(connectors[connector])
        })
      }}
    >
      {this.t('buttons.connect')}
    </RoundedButton>
  }

  renderSlider ({ walletType }) {
    const { platform } = this
    return <Slider
      t={this.t}
      platform={platform}
      walletType={walletType}
      selectWallet={({ id }) => {
        this.toggleSlider({
          showSlider: false,
          callback: () => this.actions().user.setWalletType({ walletType: id })
        })
      }}
      showSlider={_ => {
        this.toggleSlider({
          showSlider: true
        })
      }}
    />
  }

  toggleSlider ({ showSlider = true, callback }) {
    this.setState({
      showSlider
    }, () => callback && callback())
  }
}

export default WalletChoosePage
