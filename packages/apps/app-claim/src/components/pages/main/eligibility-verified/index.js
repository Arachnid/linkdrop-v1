import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import classNames from 'classnames'

@actions(({}) => ({}))
@translate('pages.main')
class EligibilityVerified extends React.Component {
  render () {
    return <div className={commonStyles.container}>
      <Alert
        icon={<Icons.Check />}
        className={styles.alert}
      />
      <div className={styles.title}>
        {this.t('titles.eligibilityVerifiedTitle')}
      </div>
      <Button
        onClick={_ => {
          this.actions().user.setStep({ step: 1 })
        }}
        className={styles.button}
      >
        Ok, Great…
      </Button>
    </div>
  }


}

export default EligibilityVerified