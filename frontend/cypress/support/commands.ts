/// <reference types="cypress" />
// ***********************************************
// Custom commands and overwrite existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("slowGQL", (delay = 500) => {
  cy.intercept(
    {
      method: "POST",
      url: "http://localhost:4000/graphql",
    },
    (req) => {
      req.continue((res) => {
        res.delay = delay
        res.send()
      })
    }
  )
})

Cypress.Commands.add(
  "getByData",
  {
    prevSubject: false,
  },
  (selector, ...args) => {
    return cy.get(`[data-test="${selector}"]`, ...args)
  }
)

Cypress.Commands.add(
  "findByData",
  {
    prevSubject: true,
  },
  (subject, selector, ...args) => {
    return cy.wrap(subject).find(`[data-test="${selector}"]`, ...args)
  }
)

Cypress.Commands.add(
  "parentByData",
  {
    prevSubject: true,
  },
  (subject, selector, ...args) => {
    return cy
      .wrap(subject)
      .parents(`[data-test="${selector}"]`, ...args)
      .first()
  }
)

Cypress.Commands.add(
  "hasTextHighlight",
  {
    prevSubject: true,
  },
  (subject, have = true) => {
    return cy
      .wrap(subject)
      .should(`${have ? "" : "not."}have.class`, "text-primary")
  }
)

Cypress.Commands.add(
  "hasBgHighlight",
  {
    prevSubject: true,
  },
  (subject, have = true) => {
    return cy
      .wrap(subject)
      .should(`${have ? "" : "not."}have.class`, "bg-primary")
  }
)

Cypress.Commands.add("isUrl", (url) => {
  return cy.location().its("pathname").should("eq", encodeURI(url))
})

declare namespace Cypress {
  interface Chainable {
    slowGQL(delay?: number): void
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
    findByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
    parentByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
    hasTextHighlight(hasHighlight?: boolean): void
    hasBgHighlight(hasHighlight?: boolean): void
    isUrl(url: string): void
  }
}
