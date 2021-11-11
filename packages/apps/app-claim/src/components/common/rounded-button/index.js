import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

const RoundedButton = props => {
  return <Button {...props} className={
    classNames(props.className, styles.container, {
      [styles.inverted]: props.inverted
    })
  }>
    {props.children}
  </Button>
}

export default RoundedButton
