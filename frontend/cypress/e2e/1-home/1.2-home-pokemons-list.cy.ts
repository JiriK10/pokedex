const { _ } = Cypress

import selectors from "../../fixtures/selectors.json"
import pokemons from "../../fixtures/pokemons.json"

import { setSearch, setListType } from "../top-controls"
import { testInfoDialog } from "../info"

const url = "/"

describe("Home page - Pokemons list", () => {
  _.each(["Grid", "List"], (listType) => {
    context(listType, () => {
      const isGrid = listType == "Grid"
      const listTypeFilter = isGrid ? "grid" : "list"
      const itemSelector = isGrid ? selectors.gridItem : selectors.listItem

      beforeEach(() => {
        cy.visit(url)
        setListType(listTypeFilter)
      })

      it("Infinite scroll", () => {
        cy.getByData(itemSelector).should("have.length", 50).as("items")
        cy.get("@items").eq(6).should("contain.text", "Squirtle")
        cy.get("@items").should("not.contain.text", "Psyduck")

        cy.scrollTo("bottom")
        cy.getByData(itemSelector).should("have.length", 100).as("items")
        cy.get("@items").eq(53).should("contain.text", "Psyduck")
        cy.get("@items").should("not.contain.text", "Koffing")

        cy.scrollTo("bottom")
        cy.getByData(itemSelector).should("have.length", 150).as("items")
        cy.get("@items").eq(108).should("contain.text", "Koffing")
        cy.get("@items").contains(new RegExp(`^Mew$`)).should("not.exist")

        cy.scrollTo("bottom")
        cy.getByData(itemSelector).should("have.length", 151).as("items")
        cy.get("@items").eq(150).contains(new RegExp(`^Mew$`)).should("exist")
      })

      _.each(pokemons, (pokemon) => {
        it(`(Un)Favorite - ${pokemon.name}`, () => {
          setSearch(pokemon.name)

          cy.getByData(selectors.favorite).should("exist").click()
          cy.getByData(selectors.unfavorite).should("exist").click()
          cy.getByData(selectors.favorite).should("exist")
        })

        it(`Open info dialog - ${pokemon.name}`, () => {
          setSearch(pokemon.name)

          cy.getByData(selectors.openInfo).click()
          testInfoDialog(pokemon)
        })

        it(`Visit detail and its Evolutions - ${pokemon.name}`, () => {
          let navigateBack = ["/"]
          setSearch(pokemon.name)

          // Navigate to detail
          let pokemonUrl = `/${pokemon.name}`
          navigateBack.push(pokemonUrl)
          cy.getByData(itemSelector).click()
          cy.isUrl(pokemonUrl)

          // Navigate to last evolution
          if (pokemon.evolutions) {
            _.each(pokemon.evolutions, (evolution) => {
              pokemonUrl = `/${evolution}`
              navigateBack.push(pokemonUrl)
              cy.getByData(itemSelector).first().click()
              cy.isUrl(pokemonUrl)
            })
          }

          // Navigate back home
          navigateBack.pop()
          _.each(navigateBack.reverse(), (previousUrl) => {
            cy.getByData(selectors.back).click()
            cy.isUrl(previousUrl)
          })
        })
      })
    })
  })
})
