import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({ tokens: { transactionId, transactionStatus } }) => ({ transactionId, transactionStatus }))
@translate('pages.main')
class ClaimingProcessPage extends React.Component {
  componentWillReceiveProps ({ transactionStatus: status }) {
    const { transactionStatus: prevStatus } = this.props
    if (status != null && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.actions().user.setStep({ step: 10 })
    }
  }

  componentDidMount () {
    const { chainId, transactionId } = this.props
    this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId, chainId }), 3000)
  }

  render () {
    const { transactionId, chainId } = this.props
    const scannerDct = {
      "100": 'seeDetailsBlockscout',      
      "97": 'seeDetailsBscScan',
      "56": 'seeDetailsBscScan',
      "137": 'seeDetailsExplorer',
      "80001": 'seeDetailsExplorer'
    }
    const seeDetails = scannerDct[String(chainId)] || 'seeDetails'
    console.log(`${defineEtherscanUrl({ chainId })}tx/${transactionId}`)
    
    return <div className={commonStyles.container}>
      <Loading container size='small' className={styles.loading} />
      {this.renderTitle()}
      <div className={styles.subtitle}>{this.t('titles.transactionInProcess')}</div>
      <div className={styles.description}>{this.t('titles.instructions')}</div>
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t(`titles.${seeDetails}`, {
            transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
          })
        }}
      />
    </div>
  }

  renderTitle () {
    return <div className={styles.title}>
      {this.t(`titles.claiming`)}
    </div>
  }
}

export default ClaimingProcessPage
