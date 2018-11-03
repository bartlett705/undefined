import { EventType, fireEvent } from 'react-testing-library'
import { Props, TTY } from '..'
import { setupTest } from '../../../test'
import { CLIResponseType } from '../../models'

const defaultProps = () => ({
  children: ['some  ', 'garbage  ', 'LUL  '],
  onSubmit: jest.fn(),
  type: CLIResponseType.Standard
})

const setup = setupTest<Props>(TTY, defaultProps)

beforeEach(jest.useFakeTimers)
afterEach(jest.useRealTimers)

const testEvents = ['click', 'mouseEnter', 'focus']

testEvents.forEach((event: EventType) => {
  it(`shows an input on ${event}`, () => {
    const { getByPlaceholderText, asFragment, getByTestId, getByText } = setup()
    const firstRender = asFragment()

    jest.runTimersToTime(3000)
    getByText('some')
    getByText('garbage')
    getByText('LUL')

    fireEvent[event](getByTestId('tty'))
    jest.runOnlyPendingTimers()

    getByPlaceholderText('help')
  })
})
