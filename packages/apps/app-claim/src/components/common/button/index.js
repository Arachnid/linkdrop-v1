import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module.scss'
import cn from 'classnames'
import React from 'react'

const ButtonComponent = (props) => {
  return <Button
    {...props}
    className={cn(
      styles.container,
      props.className
    )}
  />
}

export default ButtonComponent