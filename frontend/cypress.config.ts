import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    baseUrl: "http://localhost:3000",
    specPattern:
    [
      "cypress/e2e/**/Register.cy.tsx","cypress/e2e/**/Login.cy.tsx","cypress/e2e/**/Logout.cy.tsx",
      "cypress/e2e/**/Podcast_Create.cy.tsx", "cypress/e2e/**/Episode_Create.cy.tsx"
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
