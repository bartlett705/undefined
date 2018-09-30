import * as React from 'react'
import { CLIResponseType, CLISubmitter } from '.'

const DELAY = 100
const SLOW_CHARS = new Set([
    '.',
    ',',
    '\n',
])

export class TTY extends React.Component<
    { children: string[], type: CLIResponseType, onSubmit: CLISubmitter },
    { clicked: boolean, showInput: boolean }
    > {
    public state = { clicked: false, showInput: false }

    public render() {
        return (
            <div
                className={`tty ${this.state.clicked ? 'tty--clicked' : ''}`}
                onClick={this.showInput}
                onMouseEnter={this.showInput}
                onFocus={this.showInput}
                tabIndex={1}
            >
                <TTYOutput type={this.props.type}>
                    {this.props.children}
                </TTYOutput>
                {this.state.showInput && <TTYInput onSubmit={this.props.onSubmit} />}
            </div>
        )
    }

    private showInput = () => this.setState(
        { clicked: true },
        () => window.setTimeout(
            () => this.setState({ showInput: true }),
            300,
        ),
    )
}

class TTYInput extends React.Component<
    { onSubmit: CLISubmitter },
    { error: boolean, value: string }
    > {
    public state = { error: false, value: '' }

    public render() {
        return (
            <form
                className={`tty__input ${this.state.error ? 'tty__input--error' : ''}`}
                onSubmit={this.onSubmit}
            >
                <label htmlFor="tty__input">&gt; </label>
                <input
                    id="tty__input"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    type="text"
                    value={this.state.value}
                    onChange={(e) => this.setState({ error: false, value: e.target.value })}
                />
            </form>
        )
    }

    private onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const valueToSubmit = this.state.value
        this.setState({ value: '' })

        try {
            const { type } = await this.props.onSubmit(valueToSubmit)
            this.setState({ error: type === CLIResponseType.Error })
        } catch (err) {
            this.setState({ error: true })
        }
    }
}

interface TTYOutputProps {
    children: string[],
    type: CLIResponseType,
    onAllLinesComplete?: () => void,
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
        return (
            <div className={`tty__output ${this.props.type === CLIResponseType.Error ? 'tty__output--error' : ''}`}  >
                {(this.props.children as string[]).slice(0, this.state.currentLine).map((line, idx) => (
                    <TTYLine key={idx} onLineComplete={this.startNextLine}>
                        {line}
                    </TTYLine>
                ))}
            </div>
        )
    }

    private startNextLine = () => this.setState(
        (prevState) => ({ currentLine: prevState.currentLine + 1 }),
        () => this.state.currentLine > this.props.children.length && this.props.onAllLinesComplete
            ? this.props.onAllLinesComplete()
            : undefined,
    )
}

interface TTYLineProps { children: string, onLineComplete: () => void }

class TTYLine extends React.Component<
    TTYLineProps,
    { currentIndex: number }
    > {
    public state = { currentIndex: 0 }
    private handle: number

    public componentDidMount() {
        this.setTick(DELAY)
    }

    public componentWillUnmount() {
        clearTimeout(this.handle)
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
        this.handle = window.setTimeout(
            () => this.tick(),
            delay,
        )
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

const TTYPresentation = ({ children }: { children: string | React.ReactNode[] }) => (
    <div className="tty__line"
        data-last={children.slice(-1)}
    >
        {children.slice(0, -2)}
    </div>
)
