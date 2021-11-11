import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { Button } from 'components/common'
import text from 'texts'
import { useAuth0 } from "@auth0/auth0-react";

const AuthFinished = ({ wallet, localErrors, onClick }) => {
  const { logout } = useAuth0();
  return <div className={commonStyles.container}>
    {localErrors && localErrors.length > 0 ? null : <Alert
      icon={<Icons.Check />}
      className={styles.alert}
    />}
    <div className={styles.title}>
      {localErrors && localErrors.length > 0 ? 'Email is not approved' : text('pages.main.titles.authFinishedTitle')}
    </div>
    {(!localErrors || localErrors.length === 0) && <Button
      onClick={_ => {
        onClick && onClick()
      }}
      className={styles.button}
    >
      Claim
    </Button>}
    {localErrors && localErrors.length > 0 && <Button
      onClick={_ => {
        logout({ returnTo: window.location.origin });
      }}
      className={styles.button}
    >
      Try another email
    </Button>}
    {localErrors && localErrors.length > 0 && <div className={styles.errors}>{localErrors.join(',')}</div>}
  </div>
}

export default AuthFinished