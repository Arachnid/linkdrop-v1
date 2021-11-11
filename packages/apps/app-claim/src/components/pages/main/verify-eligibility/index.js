import React from 'react'
import { Loading, Button, Input } from '@linkdrop/ui-kit'
import { actions, translate, platform } from 'decorators'
// import ErrorPage from './error-page'
import styles from './styles.module.scss'
// import img from '../../../assets/images/img.jpeg'

@actions(({
  user: {
    loading,
    tweetCheckLoading,
    errors,
    localErrors
  }
}) => ({
  loading,
  tweetCheckLoading,
  errors,
  localErrors
}))
@platform()
@translate('pages.main')
class VerifyEligibility extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      twitterName: ''
    }
  }

  render () {
    let { twitterName } = this.state
    const { loading, address, tweetCheckLoading, localErrors } = this.props
    if (loading) {
      return <Loading />
    }

    return <div>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.verifyEligibilityTitle')
        }}
      />
      <Input
        onChange={({value}) => {
          this.setState({
            twitterName: value
          })
        }}
        className={styles.input}
        placeholder={this.t('titles.verifyEligibilityPlaceholder')}
        value={twitterName}
        
      />
      <Button
        onClick={_ => {
          this.actions().user.checkEligibility(twitterName.replace('@', ''))
        }}
        disabled={!twitterName}
        loading={tweetCheckLoading}
        className={styles.button}
      >
        Verify
      </Button>
      <div className={styles.description}>
        {this.t('titles.verifyEligibilityDescription')}
      </div>
      {localErrors && localErrors.length > 0 && <div className={styles.errors}>{localErrors.join(',')}</div>}
    </div>
  }
}


export default VerifyEligibility
