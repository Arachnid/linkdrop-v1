import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class Textarea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps ({ value }) {
    const { value: prevValue } = this.state
    const { numberInput } = this.props
    if (value == null || value === prevValue || (numberInput && Number(value) === Number(prevValue))) { return }
    this.setState({
      value: value
    })
  }

  render () {
    const { className, disabled, placeholder, centered, numberInput, extraInfo } = this.props
    const { value } = this.state
    return <div className={styles.wrapper}>
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={this.defineClassNames({ className, disabled })}
        onChange={e => this.changeValue(e)}
      />
    </div>
  }

  defineClassNames ({ className, disabled }) {
    return classNames(styles.container, className, { [styles.disabled]: disabled })
  }

  changeValue (e) {
    const { onChange } = this.props
    const value = e.target.value
    this.setState({
      value
    }, _ => onChange && onChange({ value }))
  }
}

export default Textarea
