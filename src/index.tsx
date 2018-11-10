import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../sass/main.scss'
import { CLIRequestBody, CLIResponse, CLIResponseType } from './models'
import { TTY } from './tty'

class App extends React.Component<
  {},
  { ttyContent: string[]; ttyType: CLIResponseType }
> {
  public state = {
    ttyContent: [
      '> HeyGuys, this is a website, by Ahmad.  \n',
      '> Not a whole lot to see here yet...  \n',
      '> But you could always sign the guestbook 👇 ^_^  \n'
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

  private onSubmit = async (input: string) => {
    let { ttyContent, ttyType } = {
      ttyContent: ['Unrecognized Server Response 🙁'],
      ttyType: CLIResponseType.Error
    }

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
          ({ content: ttyContent, type: ttyType } = await res.json())
          break
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.warn(err)
      ttyContent = ['Network Error. Could not reach remote system.  ']
    }

    this.setState({ ttyContent, ttyType })
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
