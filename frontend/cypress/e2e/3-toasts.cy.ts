import selectors from "../fixtures/selectors.json"
import pokemons from "../fixtures/pokemons.json"

describe("Toasts", () => {
  const pokemon = pokemons[0]
  const favoriteText = `${pokemon.name} is now your favorite!`
  const unfavoriteText = `${pokemon.name} is not your favorite anymore.`
  const closeSelector = "button[title~='close']"

  it("Home page", () => {
    cy.visit("/")

    // Favorite + button close
    cy.getByData(selectors.gridItem)
      .first()
      .as("item")
      .findByData(selectors.favorite)
      .click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", favoriteText)
    cy.get("@toast").find(closeSelector).click()
    cy.get("@toast").should("not.exist")

    // Unfavorite + button close
    cy.get("@item").findByData(selectors.unfavorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", unfavoriteText)
    cy.get("@toast").find(closeSelector).click()
    cy.get("@toast").should("not.exist")

    // Favorite + auto close
    cy.get("@item").findByData(selectors.favorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", favoriteText)
    cy.wait(5000)
    cy.get("@toast").should("not.exist")

    // Unfavorite + auto close
    cy.get("@item").findByData(selectors.unfavorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", unfavoriteText)
    cy.wait(5000)
    cy.get("@toast").should("not.exist")
  })

  it("Detail page", () => {
    cy.visit(`/${pokemon.name}`)

    // Favorite + button close
    cy.getByData(selectors.pokemon.detail)
      .as("detail")
      .findByData(selectors.favorite)
      .click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", favoriteText)
    cy.get("@toast").find(closeSelector).click()
    cy.get("@toast").should("not.exist")

    // Unfavorite + button close
    cy.get("@detail").findByData(selectors.unfavorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", unfavoriteText)
    cy.get("@toast").find(closeSelector).click()
    cy.get("@toast").should("not.exist")

    // Favorite + auto close
    cy.get("@detail").findByData(selectors.favorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", favoriteText)
    cy.wait(5000)
    cy.get("@toast").should("not.exist")

    // Unfavorite + auto close
    cy.get("@detail").findByData(selectors.unfavorite).click()
    cy.getByData(selectors.toast)
      .as("toast")
      .should("have.length", 1)
      .should("contain.text", unfavoriteText)
    cy.wait(5000)
    cy.get("@toast").should("not.exist")
  })
})
