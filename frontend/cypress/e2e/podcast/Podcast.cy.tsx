import * as paths from "../../fixtures/file_paths.json";

describe("Postcast_Create", () => {
  beforeEach(() => {
    cy.login(null, "testRegister@email.com", "password123");
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
      timeout: 5000,
    });
  });

  // User that exists should be able to create a Podcast
  it("Should successfully create a Podcast", () => {
    cy.podcast_create(
      paths.max_verstappen_cover,
      "F1 Legends",
      "A podcast about F1 veterans and their rise to glory.",
    );
    cy.url().should("include", "/AddEpisode");
    cy.contains("F1 Legends");
  });

  //Podcast should not be created if the Podcast name already exists
  it("Should not create a podcast if the same podcast name already exists", () => {
    cy.podcast_create(
      paths.max_verstappen_cover,
      "F1 Legends",
      "A podcast about F1 veterans and their rise to glory.",
    );
    cy.url().should("include", "/CreatePodcast");
    cy.contains("A podcast with the same name already exists").should("exist");
  });

  // User should be able to edit a podcast name and have it reflected immediately
  it("Should edit a Podcast", () => {
    cy.wait(250);
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible");
    cy.get('button[aria-label="loggedInMenu"]').click();
    cy.get("button").contains("My Podcasts").click();
    cy.url().should("include", "/MyPodcasts");
    cy.get("button").contains("Edit Podcast").click();
    cy.get('input[type="file"]').attachFile(paths.f2_car);
    cy.get('input[id="podcastName"]').clear().type("{selectall}{backspace}");
    cy.get('input[id="podcastName"]').type("F2 legends");
    cy.contains("Button", "Update").click();
    cy.url().should("include", "/MyPodcasts");
    cy.contains("F2 legends");
  });

  // User should be re-directed to Login if they try to create a Podcast without being logged in
  it("Should redirect you to login if a user is not logged in", () => {
    cy.logout();
    cy.visit("/");
    cy.url().should("include", "/");
    cy.get('button[aria-label="Add Episode"]').click();
    cy.url().should("include", "/auth/Login");
  });

  // Podcast should not be created if the fields are empty
  it("Should not create a podcast if fields are empty", () => {
    cy.podcast_create(paths.max_verstappen_cover, null, null);
    cy.url().should("include", "/CreatePodcast");
    cy.contains("Required.").should("exist");
  });

  // Podcast cover photos should not accept anything else other than image files
  it("Should not accept files other than image files", () => {
    cy.podcast_create(
      paths.never_gonna_give_you_up,
      "Video Games",
      "Adoption of video games in the West.",
    );
    cy.url().should("include", "/CreatePodcast");
    cy.contains("Cover art must be a JPEG, PNG, or SVG.").should("exist");
  });

  // Podcast names should be able to include special symbols not bound to ASCII characters
  it("Should accept special symbols in podcast name", () => {
    cy.podcast_create(
      paths.crazy_symbols,
      "♣™∏⊄‾ℜ→∞ϖñ",
      "A podcast about CRAZY symbols.",
    );
    cy.url().should("include", "/AddEpisode");
    cy.contains("♣™∏⊄‾ℜ→∞ϖñ");
  });

  // Users should be allowed to delete their own podcasts
  it("Should delete a Podcast", () => {
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible");
    cy.wait(500);
    cy.get('button[aria-label="loggedInMenu"]').click();
    cy.get("button").contains("My Podcasts").click();
    cy.url().should("include", "/MyPodcasts");
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.get("[data-cy=podcast-image-♣™∏⊄‾ℜ→∞ϖñ]").click();
    cy.get("[data-cy=podcast-delete").click();
    cy.contains("Button", "Delete").click();
    cy.url().should("include", "/MyPodcasts");
    cy.contains("♣™∏⊄‾ℜ→∞ϖñ").should("not.exist");
  });

  it("limits the number of characters in the input field", () => {
    cy.podcast_create(
      paths.f2_car,
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "A podcast about error handling.",
    );
    cy.url().should("include", "/AddEpisode");
    cy.visit("/MyPodcasts");
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa")
      .should("be.visible")
      .then(($element) => {
        if (!$element) {
          cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
        }
      });
    cy.contains("aaaaaaaaaaaaaaaaaaaaaaaaa");
  });
});
