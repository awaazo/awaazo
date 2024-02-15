import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: true,
    experimentalStudio: true,
    baseUrl: "http://localhost:3500",
    specPattern:
    [
      "cypress/e2e/**/Register.cy.tsx",
      "cypress/e2e/**/Login.cy.tsx",
      "cypress/e2e/**/Logout.cy.tsx",
      "cypress/e2e/**/LoginPrompt.cy.tsx",
      "cypress/e2e/**/EditProfile.cy.tsx",
      "cypress/e2e/**/ChangePassword.cy.tsx",
      "cypress/e2e/**/Podcast.cy.tsx", 
      "cypress/e2e/**/Episode.cy.tsx",
      "cypress/e2e/**/Section.cy.tsx",
      "cypress/e2e/**/PlayerBar.cy.tsx",
      "cypress/e2e/**/Review.cy.tsx",
      "cypress/e2e/**/Search.cy.tsx",
      "cypress/e2e/**/Like.cy.tsx",
      "cypress/e2e/**/Comment.cy.tsx",
      "cypress/e2e/**/Notification.cy.tsx",
      "cypress/e2e/**/Playlists.cy.tsx",
      "cypress/e2e/**/MobileTest.cy.tsx",
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 3,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 3
    },
    defaultCommandTimeout: 10000
  },
});
