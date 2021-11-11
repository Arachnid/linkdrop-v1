import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { actions } from 'decorators'

@actions(({}) => ({}))
class TokenCheck extends React.Component {
  componentDidMount () {
    const { wallet, chainId } = this.props
    this.actions().tokens.checkToken({ wallet, chainId })
  }

  render () {
    return <div className={commonStyles.container}>
      <Loading withOverlay />
    </div>
  }
}

export default TokenCheck
