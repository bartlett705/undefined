import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../sass/main.scss'
import { CLIRequestBody, CLIResponse, CLIResponseType } from './models'
import { TTY } from './tty'

export type CLISubmitter = (input: string) => Promise<CLIResponse>

class App extends React.Component<
  {},
  { ttyContent: string[]; ttyType: CLIResponseType }
> {
  public state = {
    ttyContent: [
      '> HeyoThere, barleysauce... \n',
      '> Not much to see here yet \n',
      '> But maybe, there will be stuff...at some point. \n'
    ],
    ttyType: CLIResponseType.Standard
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
      const res = await fetch('https://mosey.systems/api/cli', {
        body: JSON.stringify(buildBody(input)),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST'
      })

      switch (res.status) {
        case 200:
          const { content, type } = await res.json()
          // tslint:disable-next-line:no-console
          console.log({ content, type })
          return this.dispatchResponse(content, type)
        case 412:
          return this.dispatchResponse(
            ['Unrecognized Server Response 🙁  '],
            CLIResponseType.Error
          )
        default:
          return this.dispatchResponse(
            ['Unrecognized Server Response 🙁  '],
            CLIResponseType.Error
          )
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(err)
      return this.dispatchResponse(
        ['Network Error. Could not reach remote system.  '],
        CLIResponseType.Error
      )
    }
  }

  private dispatchResponse = (
    content: CLIResponse['content'],
    type: CLIResponseType
  ) => {
    this.setState({ ttyContent: content, ttyType: type })
    return Promise.resolve({ content, type })
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)

const buildBody = (input: string): CLIRequestBody => ({
  input,
  language:
    navigator &&
    ((navigator.languages && navigator.languages.slice()[0]) ||
      navigator.language),
  referrer: document.referrer,
  userAgent: navigator.userAgent
})
