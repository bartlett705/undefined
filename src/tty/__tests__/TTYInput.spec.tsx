import { cleanup, fireEvent } from 'react-testing-library'
import 'react-testing-library/cleanup-after-each'
import { setupTest } from '../../../test'
import { lotsOfJunk } from '../../../test/utils'
import { CLIResponseType } from '../../models'
import { Props, TTYInput } from '../TTYInput'

const defaultProps = () => ({
  cancelPost: jest.fn(),
  onSubmit: jest.fn(),
  type: CLIResponseType.Standard
})

const setup = setupTest<Props>(TTYInput, defaultProps)

it('renders a command input on mount', () => {
  const { container, getByPlaceholderText, getByValue } = setup()
  const input = getByPlaceholderText('help')

  fireEvent.change(input, { target: { value: 'some junk 🎰' } })
  getByValue('some junk 🎰')
})

it('renders a post input when a post response type is specified', () => {
  const { getByTestId } = setup({ type: CLIResponseType.StartPost })

  getByTestId('post')
})

it('post input submits; internet is 😃', () => {
  const { getByTestId, getByRole, props } = setup({
    type: CLIResponseType.StartPost
  })

  const textArea = getByTestId('post')
  fireEvent.change(textArea, { target: { value: 'some junk 🎰' } })
  const submitButton = getByRole('button')
  fireEvent.click(submitButton)

  expect(props.onSubmit).toHaveBeenCalledWith('addpost some junk 🎰')
})

it('disables post submit if post is over 160 chars', () => {
  const { getByTestId, getByRole, props } = setup({
    type: CLIResponseType.StartPost
  })

  const textArea = getByTestId('post')
  fireEvent.change(textArea, { target: { value: lotsOfJunk() } })
  const submitButton = getByRole('button')
  fireEvent.click(submitButton)

  expect(props.onSubmit).not.toHaveBeenCalled()
})

xit('is accessible', async () => {
  // jest-axe seems slightly broken as of Mar 2019: https://github.com/nickcolley/jest-axe/issues/57
  // can't figure out how to clean up after axe; it's making later tests fail, so it must be last 😭
  const { axe, container, debug } = setup()
  const result = await axe(container.innerHTML)
  debug()
  expect(result).toHaveNoViolations()
})
