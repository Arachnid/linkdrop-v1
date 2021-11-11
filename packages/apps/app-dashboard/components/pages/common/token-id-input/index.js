import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Input, Button } from 'components/common'
import classnames from 'classnames'

@translate('pages.campaignCreate')
class TokenIdInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tokenId: ''
    }
  }
  render () {
    const { tokenId } = this.state
    const { addToken, setField, className, tokenIds } = this.props
    return <div className={classnames(styles.tokenId, className)}>
      {tokenIds && tokenIds.length > 0 && <div
        className={styles.tokenIdsAdded}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.tokenIdsAdded', {
            ids: tokenIds.join(', ')
          })
        }}
      />}
      <div className={styles.tokensIdContainer}>
        <Input
          placeholder={this.t('titles.tokenIdPlaceholder')}
          value={tokenId || ''}
          className={styles.input}
          onChange={({ value }) => this.setState({
            tokenId: value
          })}
        />
        <Button
          className={styles.tokenIdButton}
          disabled={!tokenId}
          transparent
          onClick={_ => {
            addToken({ tokenId })
            this.setState({
              tokenId: ''
            })
          }}
        >
          {this.t('buttons.add')}
        </Button>
      </div>
    </div>
  }
}

export default TokenIdInput
