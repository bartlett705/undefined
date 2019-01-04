import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../sass/main.scss'
import { config } from './config'
import {
  CLIRequestBody,
  CLIResponse,
  CLIResponseType,
  Payload,
  PayloadType
} from './models'
import { Reader } from './reader'
import { TTY } from './tty'

interface State {
  readMode: boolean
  ttyContent: string[]
  ttyType: CLIResponseType
  ttyPayload?: Payload
}

class App extends React.Component<{}, State> {
  public readonly state: State = {
    readMode: false,
    ttyContent: [
      '> HeyGuys, this is a website, by Ahmad.  \n',
      '> Not a whole lot to see here yet...  \n',
      '> But you could always sign the guestbook ^_^  \n'
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
          {this.state.readMode &&
            this.state.ttyPayload && (
              <Reader posts={this.state.ttyPayload.body} />
            )}
        </main>
      </>
    )
  }

  private onSubmit = async (input: string) => {
    let { readMode, ttyContent, ttyType, ttyPayload }: Partial<State> = {
      readMode: false,
      ttyContent: ['Unrecognized Server Response :/  '],
      ttyType: CLIResponseType.Error
    }

    try {
      const res = await fetch(config.apiURI, {
        body: JSON.stringify(buildBody(input)),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST'
      })

      switch (res.status) {
        case 200:
          ({
            content: ttyContent,
            payload: ttyPayload,
            type: ttyType
          } = await res.json())
          break
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(err)
      ttyContent = ['Network Error. Could not reach remote system.  ']
    }

    if (ttyPayload && ttyPayload.type === PayloadType.Posts) {
      readMode = true
    }

    this.setState({ readMode, ttyContent, ttyType, ttyPayload })
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
