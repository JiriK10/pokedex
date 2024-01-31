const { _ } = Cypress

import selectors from "../../fixtures/selectors.json"
import topControlsFix from "../../fixtures/top-controls.json"

import { setTopControls } from "../top-controls"

const topControlsSels = selectors.topControls
const url = "/"
const localStorageName = "topControls"

describe("Home page - Top controls", () => {
  _.each(["Grid", "List"], (listType) => {
    context(listType, () => {
      const isGrid = listType == "Grid"
      const listTypeProp = isGrid ? "grid" : "list"
      const otherListTypeProp = isGrid ? "list" : "grid"

      if (isGrid) {
        it("Loading skeleton", () => {
          const skeletonSels = topControlsSels.skeleton
          cy.slowGQL()
          cy.visit(url)

          cy.getByData(skeletonSels.tab).should("have.length", 2)
          cy.getByData(skeletonSels.search).should("exist")
          cy.getByData(skeletonSels.pokemonType).should("exist")
          cy.getByData(skeletonSels.listType).should("have.length", 2)
        })
      }

      it(`Change view to ${listType}`, () => {
        const steps: Array<"grid" | "list"> = [
          listTypeProp,
          otherListTypeProp,
          listTypeProp,
        ]
        cy.visit(url)

        _.each(steps, (step) => {
          cy.getByData(topControlsSels[step])
            .click()
            .parent()
            .hasTextHighlight()
          cy.getByData(selectors[step]).should("exist")
        })
      })

      _.each(
        topControlsFix.storage.filter((s) => s.listType == listTypeProp),
        (storageValue) => {
          const nameParts = [
            storageValue.filter,
            `"${storageValue.search}"`,
            storageValue.pokemonType,
          ].join(" | ")

          it(`Init from local storage - ${nameParts}`, () => {
            window.localStorage.setItem(
              localStorageName,
              JSON.stringify(storageValue)
            )
            cy.visit(url)

            cy.getByData(topControlsSels.all).hasBgHighlight(
              storageValue.filter == "all"
            )
            cy.getByData(topControlsSels.favorite).hasBgHighlight(
              storageValue.filter == "favorite"
            )
            cy.getByData(topControlsSels.search).should(
              "have.value",
              storageValue.search
            )
            cy.getByData(topControlsSels.pokemonType).should(
              "have.value",
              storageValue.pokemonType
            )
            cy.getByData(topControlsSels.grid)
              .parent()
              .hasTextHighlight(storageValue.listType == "grid")
            cy.getByData(topControlsSels.list)
              .parent()
              .hasTextHighlight(storageValue.listType == "list")
          })

          it(`Store to local storage - ${nameParts}`, () => {
            cy.visit(url)

            setTopControls(
              storageValue.filter == "favorite",
              storageValue.search,
              storageValue.pokemonType,
              storageValue.listType as "grid" | "list"
            )
            cy.getAllLocalStorage()
              .its("http://localhost:3000")
              .its(localStorageName)
              .should("eq", JSON.stringify(storageValue))
          })
        }
      )
    })
  })
})
