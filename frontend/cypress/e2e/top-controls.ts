import selectors from "../fixtures/selectors.json"

const topControlsSels = selectors.topControls

export const setTopControls = (
  favorite: boolean | null,
  search: string | null,
  pokemonType: string | null,
  listType: "grid" | "list" | null
) => {
  if (favorite != null) {
    cy.getByData(
      favorite ? topControlsSels.favorite : topControlsSels.all
    ).click()
  }
  if (search) {
    cy.getByData(topControlsSels.search).type(search)
    cy.wait(500) // Debounce
  }
  if (pokemonType) {
    cy.getByData(topControlsSels.pokemonType).type(pokemonType).type("{enter}")
  }
  if (listType) {
    cy.getByData(topControlsSels[listType]).click()
  }
  cy.getByData(selectors.loading).should("not.exist")
}

export const setSearch = (search: string) =>
  setTopControls(null, search, null, null)

export const setListType = (listType: "grid" | "list") =>
  setTopControls(null, null, null, listType)
