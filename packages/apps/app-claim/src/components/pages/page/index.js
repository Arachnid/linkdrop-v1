import React from 'react'
import { Header, Footer, Icons, RetinaImage } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import text from 'texts'
import { getImages } from 'helpers'

@actions(({
  user: {
    step
  }
}) => ({
  step
}))
@translate('pages.page')
class Page extends React.Component {
  render () {
    const { step } = this.props
    const defineTitle = () => {
      switch(step) {
        case 4:
          return this.t('titles.addNewNetwork')
        case 6:
        case 7:
          return this.t('titles.tweetToGetNFT')
        case 8:
        case 12:
          return this.t('titles.youAreIn')
        case 11:
          return <div className={styles.headerContent}>
            <span
              onClick={_ => this.actions().user.setStep({ step: 1 })}
            >
              <RetinaImage
                width={25}
                className={styles.backArrow}
                {...getImages({ src: 'back-arrow' })}
              />
            </span>
            {this.t('titles.verifyEligibility')}
          </div>
        default:
          return this.t('titles.getTokens')
      }
    }
    return <div className={styles.container}>
      <Header
        title={defineTitle()}
      />
      <div
      className={styles.main}>
        {this.props.children}
      </div>
      <Footer
        content={text('components.footer.copyright')}
        href='https://linkdrop.io'
      />
    </div>
  }
}

export default Page
