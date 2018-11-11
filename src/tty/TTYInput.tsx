import * as React from 'react'
import { CLIResponseType } from '../models'

export interface Props {
  onSubmit: (value: State['value']) => void
  type: CLIResponseType
}

interface State {
  value: string
  isFirstCommand: boolean
}

export class TTYInput extends React.Component<Props, State> {
  public readonly state: State = {
    isFirstCommand: true,
    value:
      this.props.type === CLIResponseType.StartPost ? '25th for 45 NoKappa' : ''
  }

  public render() {
    const { value, isFirstCommand } = this.state
    const { type } = this.props
    const isPost = type === CLIResponseType.StartPost
    return (
      <form
        className={`tty__input ${
          type === CLIResponseType.Error ? 'tty__input--error' : ''
        } ${type === CLIResponseType.Info ? 'tty__input--info' : ''} ${
          type === CLIResponseType.Success ? 'tty__input--success' : ''
        }`}
        onSubmit={this.onSubmit}
      >
        <label htmlFor={`tty__input${isPost ? '--post' : ''}`}>{'> '}</label>
        {isPost ? (
          <>
            <textarea
              id="tty__input--post"
              data-testid="post"
              onChange={this.onChangeTextarea}
              value={value}
            />
            <div className="post-controls">
              <input
                role="button"
                className={`post-controls__submit ${value.length > 160 &&
                  'post-controls__submit--disabled'}`}
                type="submit"
                value="Post"
                disabled={value.length > 160}
              />
              <span
                className={`char-count ${value.length > 130 &&
                  'char-count--warning'} ${value.length > 160 &&
                  'char-count-error'}`}
              >
                {160 - value.length}
              </span>
            </div>
          </>
        ) : (
          <>
            <input
              id="tty__input"
              autoFocus
              autoComplete="off"
              placeholder={isFirstCommand ? 'help' : ''}
              spellCheck={false}
              type="text"
              value={value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </>
        )}
      </form>
    )
  }
  private onChangeTextarea = (e: { target: HTMLTextAreaElement }) => {
    this.setState({ value: e.target.value })
  }
  private onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    // console.warn('cmon, bruh')
    e.preventDefault()
    const valueToSubmit =
      (this.props.type === CLIResponseType.StartPost ? 'addpost ' : '') +
      this.state.value
    this.props.onSubmit(valueToSubmit)
    this.setState({ isFirstCommand: false, value: '' })
  }
}
