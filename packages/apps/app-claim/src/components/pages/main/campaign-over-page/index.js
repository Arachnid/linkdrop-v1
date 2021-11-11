import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import styles from './styles.module'
import commonStyles from '../styles.module'
import text from 'texts'
import { RoundedButton } from 'components/common'

const CampaignOverPage = () => {
  const renderDescription = () => {
    return <div
      className={styles.description}
      dangerouslySetInnerHTML={{
        __html: text('pages.main.titles.campaignIsOver')
      }}
    />
  }


  return <div className={commonStyles.container}>
    {renderDescription()}
  </div>
}

export default CampaignOverPage