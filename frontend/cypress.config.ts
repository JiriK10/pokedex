import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      config.specPattern = [
        "cypress/e2e/1-home/1.1-home-top-controls.cy.ts",
        "cypress/e2e/1-home/1.2-home-pokemons-list.cy.ts",
        "cypress/e2e/1-home/1.3-home-filtering.cy.ts",
        "cypress/e2e/2-detail.cy.ts",
        "cypress/e2e/3-toasts.cy.ts",
      ]
      return config
    },
  },
})
