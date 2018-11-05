// tslint:disable-next-line:no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    getTTYInput: () => Chainable<Chainable>
    login: (u: string) => Chainable<Chainable>
    logout: () => Chainable<Chainable>
  }
}

Cypress.Commands.add('getTTYInput', () => {
  return cy
    .visit('/')
    .get('[data-testid=tty]')
    .focus()
    .get('#tty__input')
})

Cypress.Commands.add('login', (username: string) => {
  cy.getTTYInput().type(`login ${username}{enter}`)
  return cy
    .get('[data-testid=tty]', { timeout: 5000 })
    .contains(`Hello ${username}`)
})

Cypress.Commands.add('logout', () => {
  return cy.getTTYInput().type('logout{enter}')
  cy.contains('🖖')
})
