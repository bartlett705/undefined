describe('Login', () => {
  it('initial login requires username', () => {
    cy.getTTYInput().type('login{enter}')
    cy.contains(/who/i)
  })

  it('log you in', () => {
    cy.logout()
    cy.login('steakhouse')
  })

  it('lets you re-use sessions with the same name', () => {
    cy.getTTYInput().type('login steakhouse{enter}')
    cy.contains(/welcome back/i)
    cy.logout()
  })
})
