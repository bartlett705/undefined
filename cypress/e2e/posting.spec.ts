import { config } from '../../src/config'
import { lotsOfJunk } from '../../test/utils'

describe('Posting', () => {
  it('requires login to post', () => {
    cy.server()
    cy.route({
      method: 'POST',
      response: [],
      status: 500,
      url: '**/api/cli'
    })
    cy.logout()

    cy.getTTYInput().type('post{enter}')
    cy.contains(/must be logged in/i)
  })

  it('shows post input', () => {
    cy.login('steakouse')
    cy.getTTYInput().type('post{enter}')
    cy.contains(/what have you got/i)
  })

  it('does not allow long posts', () => {
    cy.get('textarea').type(lotsOfJunk())
    cy.get('input')
      .should('have.attr', 'role', 'button')
      .should('have.attr', 'disabled')
    cy.get('textarea').clear()
  })

  it('makes posts', () => {
    const url = `https://newsapi.org/v2/top-headlines?sources=ars-technica&apiKey=${
      config.newsAPIKey
    }`
    cy.request(url).then((resp) => {
      let content = '*widely beloved discourse*'
      if (resp && resp.body && resp.body.articles) {
        content = resp.body.articles[0].title
      }
      cy.get('textarea').type(content)
      cy.get('input').click()
      cy.contains(/your thoughts/i)
    })
  })
})
