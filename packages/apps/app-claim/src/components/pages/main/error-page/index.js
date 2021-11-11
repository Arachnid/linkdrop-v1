import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class ErrorPage extends React.Component {
  render () {
    const { error, network } = this.props
    const instructions = this.defineInstructions({ error, network })
    const messageIsTranslatable = error.split(' ').length === 1
    const description = messageIsTranslatable ? this.t(`errors.${error}.description`, { network }): ''
    const title = messageIsTranslatable ? this.t(`errors.${error}.title`, { network }) : error
    return <div className={commonStyles.container}>
      <Alert className={styles.alert} icon={this.defineIcon({ error })} />
      <div className={styles.title}>{title}</div>
      {description.length > 0 && <div className={styles.description}>{description}</div>}
      {Object.keys(instructions).length > 0 && <div className={styles.instructions}>
        {Object.keys(instructions).map(item => <div dangerouslySetInnerHTML={{ __html: instructions[item] }} />)}
      </div>}
    </div>
  }

  defineInstructions ({ error, network }) {
    switch (error) {
      case 'CONNECTOR_NETWORK_NOT_SUPPORTED':
      case 'NETWORK_NOT_SUPPORTED':
      case 'NEED_METAMASK':
        return this.t(`errors.${error}.instructions`, { returnObjects: true, network })
      default:
        return {}
    }
  }

  defineIcon ({ error }) {
    switch (error) {
      case 'LINK_EXPIRED':
        return <Icons.Clock />
      case 'NETWORK_NOT_SUPPORTED':
        return <Icons.Exclamation />
      case 'LINK_CANCELED':
        return <Icons.Cross />
      default:
        return <Icons.Exclamation />
    }
  }
}

export default ErrorPage
