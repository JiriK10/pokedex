const { _ } = Cypress

import selectors from "../fixtures/selectors.json"
import pokemons from "../fixtures/pokemons.json"

import { testInfoDialog, testInfoDialogCaption } from "./info"

_.each(pokemons, (pokemon) => {
  describe(`Detail page - ${pokemon.name}`, () => {
    const pokemonSels = selectors.pokemon
    const pokValsSels = selectors.pokemon.values
    const url = `/${pokemon.name}`

    it("Loading", () => {
      cy.slowGQL()
      cy.visit(url)

      cy.getByData(selectors.loading).should("exist")
      cy.getByData(selectors.loading).should("not.exist")
      cy.getByData(pokemonSels.detail).should("exist")
    })

    it("Appearance", () => {
      cy.visit(url)

      cy.getByData(pokemonSels.detail).within(() => {
        // Image
        cy.getByData(selectors.image).should(
          "have.attr",
          "src",
          `https://img.pokemondb.net/artwork/${pokemon.name
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll(" ", "-")}.jpg`
        )

        // Icon buttons
        cy.getByData(selectors.back).should("exist")
        cy.getByData(selectors.playSound).should("exist")
        cy.getByData(selectors.openInfo).should("exist")
        cy.getByData(selectors.favorite).should("exist")

        // Text values
        cy.get("h1").should("have.text", pokemon.name)
        cy.getByData(pokValsSels.types).should("have.text", pokemon.types)
        cy.getByData(pokValsSels.maxCP).should(
          "have.text",
          `CP: ${pokemon.maxCP}`
        )
        cy.getByData(pokValsSels.maxHP).should(
          "have.text",
          `HP: ${pokemon.maxHP}`
        )
        cy.getByData(pokValsSels.weight).should("have.text", pokemon.weight)
        cy.getByData(pokValsSels.height).should("have.text", pokemon.height)
      })
    })

    it("(Un)Favorite", () => {
      cy.visit(url)

      cy.getByData(pokemonSels.detail).within(() => {
        cy.getByData(selectors.favorite).should("exist").click()
        cy.getByData(selectors.unfavorite).should("exist").click()
        cy.getByData(selectors.favorite).should("exist")
      })
    })

    it("Open info dialog", () => {
      cy.visit(url)

      cy.getByData(pokemonSels.detail).findByData(selectors.openInfo).click()
      testInfoDialog(pokemon)
    })

    it("Play sound", () => {
      cy.visit(url)

      cy.getByData(selectors.playSound).should("have.class", "paused").click()
      cy.getByData(selectors.playSound).should("have.class", "playing")
      cy.getByData(selectors.playSound).should("have.class", "paused")
    })

    if (pokemon.evolutions) {
      const evolution = pokemon.evolutions[0]

      it(`Evolutions - (Un)Favorite - ${evolution}`, () => {
        cy.visit(url)

        cy.getByData(selectors.gridItem)
          .first()
          .within(() => {
            cy.getByData(selectors.favorite).should("exist").click()
            cy.getByData(selectors.unfavorite).should("exist").click()
            cy.getByData(selectors.favorite).should("exist")
          })
      })

      it(`Evolutions - Open info dialog - ${evolution}`, () => {
        cy.visit(url)

        cy.getByData(selectors.gridItem)
          .first()
          .findByData(selectors.openInfo)
          .click()
        testInfoDialogCaption(evolution)
      })
    }
  })
})
