import selectors from "../fixtures/selectors.json"
import pokemons from "../fixtures/pokemons.json"

const valuesSels = selectors.pokemon.values
const attacksSels = selectors.pokemon.attacks

export const testInfoDialogCaption = (pokemonName: string) => {
  cy.getByData(selectors.pokemon.info)
    .get("h3")
    .should("have.text", pokemonName)
}

export const testInfoDialog = (pokemon: (typeof pokemons)[0]) => {
  cy.getByData(selectors.pokemon.info).within(() => {
    // Pokemon attributes
    const map: { [key: string]: string } = {}
    map[valuesSels.classification] = pokemon.classification
    map[valuesSels.types] = pokemon.types
    map[valuesSels.resistant] = pokemon.resistant
    map[valuesSels.weaknesses] = pokemon.weaknesses
    map[valuesSels.fleeRate] = pokemon.fleeRate
    map[valuesSels.maxCP] = pokemon.maxCP
    map[valuesSels.maxHP] = pokemon.maxHP
    map[valuesSels.weight] = pokemon.weight
    map[valuesSels.height] = pokemon.height
    if (pokemon.evolutionRequirements) {
      map[valuesSels.evolutionRequirements] = pokemon.evolutionRequirements
    }

    cy.get("h3").should("have.text", pokemon.name)
    Object.entries(map).forEach(([selector, value]) => {
      cy.getByData(selector).should("have.text", value)
    })

    // Pokemon attacks
    cy.getByData(attacksSels.attack).each(($el, index) => {
      const attack = pokemon.attacks[index]
      cy.wrap($el).within(() => {
        cy.getByData(attacksSels.name).should("have.text", attack.name)
        cy.getByData(attacksSels.variant).should("have.text", attack.variant)
        cy.getByData(attacksSels.type).should("have.text", attack.type)
        cy.getByData(attacksSels.damage).should("have.text", attack.damage)
      })
    })
  })
}
