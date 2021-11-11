import React from 'react'
import { Loading, Button, Input } from '@linkdrop/ui-kit'
import { actions, translate, platform } from 'decorators'
import { copyToClipboard } from '@linkdrop/commons'
import { Textarea } from 'components/common'
import styles from './styles.module.scss'
import cn from 'classnames'
import { tweetAddressSalt } from 'app.config.js'
import { utils } from 'ethers'

const posts = [
  "Airdrop! I just claimed #GZYFIRSTCOME #NFT that unlocks something amazing in @kryptochurch‘s metaverse\n\n🏆Free to claim, limited supply\n⚠️ Must have been following @LinkDropHQ and @kryptochurch\n\nThis is KryptoChurch In BlockChain We Trust."
]

@actions(({
  user: {
    loading,
    tweetCheckLoading,
    localErrors
  }
}) => ({
  loading,
  tweetCheckLoading,
  localErrors
}))
@platform()
@translate('pages.main')
class Tweet extends React.Component {
  constructor (props) {
    super(props)
    this.sig = ''
    const post = posts[0]
    this.state = {
      tweetPost: post,
      tweetLink: ''
    }
  }

  componentDidMount () {
    const { tweetPost } = this.state
    const { wallet } = this.props
    const message = wallet + tweetAddressSalt
    const messageBytes = utils.toUtf8Bytes(message)
    this.sig = utils.keccak256(messageBytes).substring(2, 8)
    this.setState({
      tweetPost: tweetPost + ` sig:${this.sig}`
    })
  }

  render () {
    let { tweetPost, tweetLink } = this.state
    const { loading, wallet, tweetCheckLoading, localErrors, onClick } = this.props
    const postLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetPost)}`
    if (loading) {
      return <Loading />
    }

    if (!wallet) {
      return <div>Error</div>
    }
    return <div>
      <Textarea
        value={tweetPost}
        className={styles.textarea}
        onChange={({value}) => {
          this.setState({
            tweetPost: value
          })
        }}
      />
      <div className={styles.buttons}>
        <Button
          onClick={_ => {
            gtag('event', 'tweet_text_copy', {
              'event_label': 'tweet text copy',
              'event_category': 'tweet_text_copy'
            });
            copyToClipboard({ value: tweetPost })
          }}
          inverted
          className={styles.buttonSmall}
        >
          Copy
        </Button>

        <Button
          target='_blank'
          href={postLink}
          className={cn(styles.buttonSmall, styles.twitterButton)}
        >
          Tweet
        </Button>
      </div>
      <div className={styles.instruction}>
        {this.t('titles.uniqueSignature', {
          sig: this.sig
        })}
      </div>
      <Button
        onClick={_ => {
          gtag('event', 'tweeted', {
            'event_label': 'tweeted',
            'event_category': 'tweeted'
          });
          onClick()
        }}
        loading={tweetCheckLoading}
        className={styles.button}
      >
        I've tweeted…
      </Button>
      {localErrors && localErrors.length > 0 && <div className={styles.errors}>{localErrors.join(',')}</div>}
    </div>
  }
}


export default Tweet
