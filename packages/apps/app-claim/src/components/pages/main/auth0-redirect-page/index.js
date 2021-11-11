import React, { useEffect, useState } from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module.scss'
import { Button } from 'components/common'
import commonStyles from '../styles.module'
import { useAuth0 } from "@auth0/auth0-react";
import text from 'texts'
const Auth0RedirectPage =  ({ onJWTReady }) => {

  const { loginWithRedirect, logout } = useAuth0();
  const user = useAuth0();
  const [jwt, setJwt] = useState(null)
  
  const getUserToken = async () => {
    if (user.getIdTokenClaims) {
      const { __raw } = await user.getIdTokenClaims()
      if (__raw) {
        onJWTReady && onJWTReady({ jwt: __raw })
      }
    }
  }

  useEffect(_ => {
    if (user.isAuthenticated) {
      getUserToken()
    }
  }, [user])
  

  return <div className={commonStyles.container}>
    <div className={styles.title}>
      {text('pages.main.titles.verifyTitle')}
    </div>
    <Button
      onClick={() => loginWithRedirect()}
      className={styles.button}
    >
      Verify Email…  
    </Button>
    <button
      onClick={_ => logout()}
      className={styles.fakeButton}
    />
    <div className={styles.description}>
      {text('pages.main.titles.verifyEligibilityDescription')}
    </div>
  </div>
}


export default Auth0RedirectPage
