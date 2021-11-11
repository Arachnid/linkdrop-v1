import React from 'react'
import { Loading, Button, Input } from '@linkdrop/ui-kit'
import { actions, translate, platform } from 'decorators'
// import ErrorPage from './error-page'
import styles from './styles.module.scss'

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
class CheckTweet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tweetLink: ''
    }
  }


  isInputDisabled () {
    const { tweetLink } = this.state
    try {
      if (!tweetLink) {
        return true
      }
      
      const parsedUrl = new URL(tweetLink)
      if (parsedUrl.origin !== 'https://twitter.com') {
        return true
      }

      const parsedUrlParts = parsedUrl.pathname.split('/')
      if (parsedUrlParts.length !== 4) {
        return true
      }
      return false
    } catch (err) {
      return true
    }    
  }

  render () {
    let { tweetLink } = this.state
    const { loading, wallet, tweetCheckLoading, localErrors, chainId } = this.props
    if (loading) {
      return <Loading />
    }

    return <div>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.toGetVarified')
        }}
      />
      <Input
        onChange={({value}) => {
          this.setState({
            tweetLink: value
          }, _ => {
            gtag('event', 'tweet_pasted', {
              'event_label': 'Tweet link pasted',
              'event_category': 'tweet_pasted'
            });
          })
        }}
        className={styles.input}
        placeholder={this.t('titles.pasteLink')}
        value={tweetLink}
        
      />
      <Button
        onClick={_ => {
          this.actions().user.checkTweet(tweetLink, wallet, chainId)
        }}
        disabled={this.isInputDisabled()}
        loading={tweetCheckLoading}
        className={styles.button}
      >
        Verify
      </Button>
      {localErrors && localErrors.length > 0 && <div className={styles.errors}>{localErrors.join(',')}</div>}
      <div className={styles.description}>
        {this.t('titles.verifyEligibilityDescription')}
      </div>
    </div>
  }
}


export default CheckTweet
