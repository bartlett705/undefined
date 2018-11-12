it('shows available commands', () => {
  cy.getTTYInput().type('help{enter}')
  cy.contains(/publicly/i)
})

describe('weather', () => {
  it('gets weather info for a zip code', () => {
    cy.getTTYInput().type('weather 92056{enter}')
    cy.get('[data-testid=tty]', { timeout: 5000 }).contains(/oceanside/i)
  })
})

it.only('enters read mode', () => {
  cy.getTTYInput().type('read{enter}')
  cy.get('.reader').contains(/steakhouse/)
})
