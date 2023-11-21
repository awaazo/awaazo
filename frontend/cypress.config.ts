import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    baseUrl: "http://localhost:3500",
    specPattern:
    [
      "cypress/e2e/**/Register.cy.tsx",
      "cypress/e2e/**/Login.cy.tsx",
      "cypress/e2e/**/Logout.cy.tsx",
      "cypress/e2e/**/EditProfile.cy.tsx",
      "cypress/e2e/**/Podcast.cy.tsx", 
      "cypress/e2e/**/Episode.cy.tsx", 
      "cypress/e2e/**/Review.cy.tsx"
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
