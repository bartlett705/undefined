import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../sass/main.scss'
import { TTY } from './tty'

const App = () => (
    <>
        <header>
            <h1>A website by Ahmad</h1>
        </header>
        <TTY>
            {'> HeyoThere, barleysauce...\n'}
            {'> Not much to see here yet \n'}
            {'> But maybe, there will be stuff...at some point. \n'}
        </TTY>
    </>
)

ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement,
)
