import * as React from 'react'
import { Component } from 'react'

const DELAY = 100
const SLOW_CHARS = new Set([
    '.',
    ',',
    '\n',
])

export class TTY extends React.Component<
    { children: string[] },
    { currentLine: number }
> {
    public state = { currentLine: 1 }

    public render() {
        return (this.props.children as string[]).slice(0, this.state.currentLine).map((line) => (
            <p>
                <TTYLine onLineComplete={this.startNextLine}>
                    {line}
                </TTYLine>
            </p>
        ))
    }

    private startNextLine = () => this.setState((prevState) => ({ currentLine: prevState.currentLine + 1 }))
}

class TTYLine extends React.Component<
    { children: string, onLineComplete: () => void },
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

    public render() {
        return (
            <TTYPresentation>
                {this.props.children.slice(0, this.state.currentIndex)}
            </TTYPresentation>
        )
    }

    private setTick = (delay: number) => {
        this.handle = setTimeout(
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
    <div className="tty">
        <span className="tty__char">
            {children.slice(0, -2)}
        </span>
        <span className="tty__char--almost-last">
            {children.slice(-2, -1)}
        </span>
        <span className="tty__char--last">

            {children.slice(-1)}
        </span>
    </div>
)
