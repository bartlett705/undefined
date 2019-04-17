import { EventType, fireEvent } from 'react-testing-library'
import { Props, TTY } from '..'
import { setupTest } from '../../../test'
import { CLIResponseType } from '../../models'

const defaultProps = () => ({
  cancelPost: jest.fn(),
  children: ['some  ', 'garbage  ', 'LUL  '],
  onSubmit: jest.fn(),
  type: CLIResponseType.Standard
})

const setup = setupTest<Props>(TTY, defaultProps)

beforeEach(jest.useFakeTimers)
afterEach(jest.useRealTimers)

const testEvents = ['click', 'mouseEnter']

testEvents.forEach((event: EventType) => {
  it(`shows an input on ${event}`, () => {
    const { getByPlaceholderText, asFragment, getByTestId, getByText } = setup()
    const firstRender = asFragment()

    jest.runTimersToTime(3000)
    getByText('some')
    getByText('garbage')
    getByText('LUL')

    expect(
      getByPlaceholderText('help').parentElement.parentElement.className
    ).not.toMatch(/clicked/)

    fireEvent[event](getByTestId('tty'))

    expect(
      getByPlaceholderText('help').parentElement.parentElement.className
    ).toMatch(/clicked/)
  })
})

it('shows an input after eleven seconds', () => {
  const { getByPlaceholderText, asFragment, getByTestId, getByText } = setup()
  expect(
    getByPlaceholderText('help').parentElement.parentElement.className
  ).not.toMatch(/clicked/)
  jest.runTimersToTime(11_000)
  expect(
    getByPlaceholderText('help').parentElement.parentElement.className
  ).toMatch(/clicked/)
})
