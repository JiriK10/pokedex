const { _ } = Cypress

import selectors from "../../fixtures/selectors.json"
import presetFavorite from "../../fixtures/favorite.json"
import topControlsFix from "../../fixtures/top-controls.json"

import { setTopControls } from "../top-controls"

const topControlsSels = selectors.topControls
const pokemonListSels = selectors.pokemonList
const url = "/"

describe("Home page - Filtering", () => {
  before(() => {
    cy.visit(url)

    // Load all
    cy.getByData(selectors.gridItem).should("have.length", 50)
    cy.scrollTo("bottom")
    cy.getByData(selectors.gridItem).should("have.length", 100)
    cy.scrollTo("bottom")
    cy.getByData(selectors.gridItem).should("have.length", 150)
    cy.scrollTo("bottom")
    cy.getByData(selectors.gridItem).should("have.length", 151)

    // Make favorite
    cy.getByData(selectors.gridItem).as("items")
    _.each(presetFavorite, (favoriteName) => {
      cy.get("@items")
        .contains(new RegExp(`^${favoriteName}$`))
        .parentByData(selectors.gridItem)
        .findByData(selectors.favorite)
        .click()
    })
  })

  after(() => {
    cy.clearLocalStorage()
    cy.visit(url)

    // Remove all favorite
    cy.getByData(topControlsSels.favorite).click()
    cy.getByData(selectors.gridItem).should(
      "have.length",
      presetFavorite.length
    )
    for (let i = 0; i < presetFavorite.length; i++) {
      cy.getByData(selectors.gridItem)
        .first()
        .findByData(selectors.unfavorite)
        .click()
    }
  })

  beforeEach(() => {
    cy.visit(url)
  })

  _.each(["Grid", "List"], (listType) => {
    _.each(topControlsFix.filters, (filters) => {
      let nameParts = [filters.favorite ? "Favorite" : "All"]
      if (filters.type) {
        nameParts.push(filters.type)
      }
      if (filters.search) {
        nameParts.push(`"${filters.search}"`)
      }

      it(`${listType} - ${nameParts.join(" | ")}`, () => {
        const isGrid = listType == "Grid"
        const itemSelector = isGrid ? selectors.gridItem : selectors.listItem

        setTopControls(
          filters.favorite,
          filters.search,
          filters.type,
          isGrid ? "grid" : "list"
        )

        if (Array.isArray(filters.result)) {
          cy.getByData(itemSelector)
            .as("items")
            .should("have.length", filters.result.length)
          _.each(filters.result, (pokemonName) => {
            cy.get("@items")
              .contains(new RegExp(`^${pokemonName}$`))
              .should("exist")
          })
          cy.getByData(pokemonListSels.noItems).should("not.exist")
        } else {
          const count = filters.result

          // Single scroll is enough (cannot filter more)
          if (count > 50) {
            cy.getByData(itemSelector).should("have.length", 50)
            cy.scrollTo("bottom")
          }

          cy.getByData(itemSelector).should("have.length", count)
          cy.getByData(pokemonListSels.noItems).should(
            `${count > 0 ? "not." : ""}exist`
          )
        }
      })
    })
  })
})
