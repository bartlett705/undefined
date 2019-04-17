import * as React from 'react'
import { CLIResponseType } from '../models'
import { TTYInput } from './TTYInput'

const DELAY = 75
const SLOW_CHARS = new Set(['.', ',', '\n'])

export interface Props {
  children: string[]
  cancelPost: () => void
  type: CLIResponseType
  onSubmit: (value: string) => void
}

export class TTY extends React.Component<Props, { clicked: boolean }> {
  public state = { clicked: false }
  private timerHandle: number
  public componentDidMount() {
    this.timerHandle = window.setTimeout(() => this.setState({ clicked: true }), 11_000)
  }
  public componentWillUnmount() {
    window.clearTimeout(this.timerHandle)
  }
  public render() {
    const { cancelPost, type } = this.props
    return (
      <div
        className={`tty ${this.state.clicked &&
          (type === CLIResponseType.StartPost
            ? 'tty--posting'
            : 'tty--clicked')}`}
        onClick={this.showInput}
        onMouseEnter={this.showInput}
        tabIndex={1}
        data-testid="tty"
      >
        <TTYOutput type={type}>{this.props.children}</TTYOutput>
        {
          <TTYInput
            onSubmit={this.props.onSubmit}
            cancelPost={cancelPost}
            type={type}
          />
        }
      </div>
    )
  }

  private showInput = () => this.setState({ clicked: true })
}

interface TTYOutputProps {
  children: string[]
  type: CLIResponseType
  onAllLinesComplete?: () => void
}

export class TTYOutput extends React.Component<
  TTYOutputProps,
  { currentLine: number }
> {
  public state = { currentLine: 1 }

  public componentDidUpdate(prevProps: TTYOutputProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ currentLine: 1 })
    }
  }

  public render() {
    const { type } = this.props
    return (
      <div
        className={`tty__output ${
          type === CLIResponseType.Error ? 'tty__output--error' : ''
        } ${type === CLIResponseType.Info ? 'tty__output--info' : ''} ${
          type === CLIResponseType.Success ? 'tty__output--success' : ''
        }`}
      >
        {(this.props.children as string[])
          .slice(0, this.state.currentLine)
          .map((line, idx) => (
            <TTYLine key={idx} onLineComplete={this.startNextLine}>
              {line}
            </TTYLine>
          ))}
      </div>
    )
  }

  private startNextLine = () =>
    this.setState(
      (prevState) => ({ currentLine: prevState.currentLine + 1 }),
      () =>
        this.state.currentLine > this.props.children.length &&
        this.props.onAllLinesComplete
          ? this.props.onAllLinesComplete()
          : undefined
    )
}

interface TTYLineProps {
  children: string
  onLineComplete: () => void
}

class TTYLine extends React.Component<TTYLineProps, { currentIndex: number }> {
  public state = { currentIndex: 0 }
  private handle: number

  public componentDidMount() {
    this.setTick(DELAY)
  }

  public componentWillUnmount() {
    window.clearTimeout(this.handle)
  }

  public componentDidUpdate(prevProps: TTYLineProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ currentIndex: 0 }, () => this.setTick(DELAY))
    }
  }

  public render() {
    return (
      <TTYPresentation>
        {this.props.children.slice(0, this.state.currentIndex)}
      </TTYPresentation>
    )
  }

  private setTick = (delay: number) => {
    this.handle = window.setTimeout(() => this.tick(), delay)
  }

  private tick = () => {
    const { children, onLineComplete } = this.props
    const { currentIndex } = this.state
    let delay = DELAY

    if (SLOW_CHARS.has(children[currentIndex])) {
      delay = delay * 3
    }

    if (this.state.currentIndex + 1 < this.props.children.length) {
      this.setTick(delay)
    } else {
      onLineComplete()
    }

    this.setState((prevState) => ({ currentIndex: prevState.currentIndex + 1 }))
  }
}

const TTYPresentation = ({
  children
}: {
  children: string | React.ReactNode[]
}) => (
  <div className="tty__line" data-last={children.slice(-1)}>
    {children.slice(0, -2)}
  </div>
)
