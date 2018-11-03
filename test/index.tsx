import { configureAxe } from 'jest-axe'
import * as React from 'react'
import { render } from 'react-testing-library'

type DefaultPropGenerator<T> = () => T

const axe = configureAxe({
  rules: {
    // TODO: research more how much this one matters for our use case
    'aria-allowed-role': { enabled: false }
  }
})

export function setupTest<T = Record<string, any>>(
  Component: React.ComponentClass | React.SFC,
  // TODO: There's gotta be a better propTypes-type type 🙃
  defaultPropGenerator: DefaultPropGenerator<T>
) {
  return (overrides?: Partial<T>) => {
    // hnnnggrrh, comon, seriously?
    const props = {
      ...(defaultPropGenerator() as {}),
      ...(overrides as {})
    } as T

    return {
      axe,
      props,
      ...render(<Component {...props} />)
    }
  }
}
