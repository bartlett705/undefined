import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../sass/main.scss'
import { TTY } from './tty'

export enum CLIResponseType {
    Error = 'ERROR',
    Success = 'SUCCESS',
    Info = 'INFO',
}

interface CLIResponse {
    type: CLIResponseType
    body: string[]
}

export type CLISubmitter = (input: string) => Promise<CLIResponse>

class App extends React.Component<
    {},
    { ttyContent: string[], ttyType: CLIResponseType }
    > {
    public state = {
        ttyContent: [
            '> HeyoThere, barleysauce... \n',
            '> Not much to see here yet \n',
            '> But maybe, there will be stuff...at some point. \n',
        ],
        ttyType: CLIResponseType.Info,
    }

    public render() {
        return (
            <>
                <header>
                    <h1>A website by Ahmad</h1>
                </header>
                <main>
                    <TTY type={this.state.ttyType} onSubmit={this.onSubmit}>
                        {this.state.ttyContent}
                    </TTY>
                </main>
            </>
        )
    }

    private onSubmit = async (input: string): Promise<CLIResponse> => {
        try {
            const res = await fetch(
                'mosey.sytems/api/cli',
                {
                    body: input,
                    method: 'POST',
                },
            )

            if (res.status === 200) {
                const { body, type } = await res.json()
                this.setState({ ttyContent: body, ttyType: type })
                return Promise.resolve({ body, type })
            }

            return this.dispatchResponse(
                ['Unrecognized Server Response 🙁 '],
                CLIResponseType.Error,
            )

        } catch (err) {
            return this.dispatchResponse(
                ['Network Error. Could not reach remote system.'],
                CLIResponseType.Error,
            )
        }
    }

    private dispatchResponse = (body: CLIResponse['body'], type: CLIResponseType) => {
        this.setState({ ttyContent: body, ttyType: type })
        return Promise.resolve({ body, type })
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement,
)
