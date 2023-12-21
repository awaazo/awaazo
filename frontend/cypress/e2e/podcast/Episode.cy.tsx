import * as paths from "../../fixtures/file_paths.json";

describe("Episode_Create", () => {
  beforeEach(() => {
    cy.login(null, "testRegister@email.com", "password123");
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
      timeout: 5000,
    });
  });

  // User that exists should be able to create an Episode given that a Podcast exists
  it("Should Successfully create a new Episode", function () {
    cy.episode_create(
      paths.Episode_cover,
      "Charles Leclerc",
      "From his rise in f2 to his demise at Ferrari",
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.contains("Charles Leclerc");
    cy.contains("From his rise in f2 to his demise at Ferrari");
  });

  //Podcast should not be created if the Episode name already exists
  it("Should not create an Episode if the episode already exists", function () {
    cy.episode_create(
      paths.Episode_cover,
      "Charles Leclerc",
      "From his rise in f2 to his demise at Ferrari",
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.url().should("include", "/CreatorHub/AddEpisode");
    cy.contains(
      "An episode with the same name already exists for this podcast.",
    ).should("exist");
  });

  // User should be able to edit a episode name and have it reflected immediately
  it("Should successfully edit an episode", function () {
    cy.wait(500);
    cy.get('button[aria-label="loggedInMenu"]').click({ timeout: 5000 });
    cy.get("button").contains("My Podcasts").click({ timeout: 5000 });
    cy.url().should("include", "/MyPodcasts");
    cy.wait(250);
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.get("[data-cy=edit-button]").first().click();
    cy.wait(250);
    cy.get('input[placeholder="Enter episode name..."]')
      .clear()
      .type("{selectall}{backspace}");
    cy.get('input[placeholder="Enter episode name..."]').type(
      "Romain Grosjean",
    );
    cy.contains("Button", "Update").click();
    cy.url().should("include", "/MyPodcasts");
    cy.wait(250);
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.contains("Romain Grosjean");
  });

  // Episodes should not be created if the fields are empty
  it("Should not create an Episode if the fields are blank.", function () {
    cy.episode_create(
      paths.Episode_cover,
      null,
      null,
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.url().should("include", "/CreatorHub/AddEpisode");
    cy.contains("Required.").should("exist");
  });

  // Episode should not be created if it's not linked to a Podcast
  it("Should not create an Episode if no podcast is selected.", function () {
    cy.episode_create(
      paths.Episode_cover,
      null,
      null,
      paths.never_gonna_give_you_up,
      null,
    );
    cy.url().should("include", "/CreatorHub/AddEpisode");
    cy.contains("Please select the Podcast you wish to upload to");
  });

  // Users should be allowed to delete their own episodes
  it("Should successfully delete an episode", function () {
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible");
    cy.get('button[aria-label="loggedInMenu"]').click();
    cy.get("button")
      .contains("My Podcasts")
      .should("be.visible")
      .click({ timeout: 5000 });
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.wait(250);
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.get("[data-cy=delete-button]").first().click();
    cy.contains("Button", "Delete").click({ timeout: 5000 });
    cy.url().should("include", "/CreatorHub/MyPodcasts");
  });

  // Episode names should be able to include special symbols not bound to ASCII characters
  it("Should accept special symbols in episode name", () => {
    cy.episode_create(
      paths.crazy_symbols,
      "♣™∏⊄‾ℜ→∞ϖñ",
      "Episode about cool symbols",
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.wait(750);
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.wait(250);
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.contains("♣™∏⊄‾ℜ→∞ϖñ");
    cy.contains("Episode about cool symbols");
  });

  //Should add an episode from the podcast interface
  it("Should add an episode from the Podcast interface", () => {
    cy.get('button[aria-label="loggedInMenu"]').should("be.visible");
    cy.get('button[aria-label="loggedInMenu"]').click();
    cy.get("button")
      .contains("My Podcasts")
      .should("be.visible")
      .click({ timeout: 5000 });
    cy.get("button").contains("New Episode").click({ timeout: 5000 });
    cy.get('input[type="file"]').attachFile(paths.Episode_cover_science);
    cy.get('input[placeholder="Enter episode name..."]').type(
      "Has science gone too far?",
    );
    cy.get('textarea[placeholder="Enter episode description..."]').type(
      "Is AI the future?!",
    );
    cy.get('[data-cy="podcast-file-dropzone"]')
      .should("be.visible")
      .within(() => {
        cy.get('input[type="file"]').attachFile(paths.never_gonna_give_you_up);
      });
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.get("button[id=createBtn]").click();
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.wait(250);
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.contains("Has science gone too far?").should("be.visible", { timeout: 5000 });
    cy.contains("Is AI the future?!").should("be.visible", { timeout: 5000 });
  });

  //There should be a 25 character limit for an episoode title
  it("limits the number of characters in the input field", () => {
    cy.episode_create(
      paths.profile_picture,
      "This is a very long episode title that should be cut off after 25 characters",
      "Testing so fun!!",
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.wait(1000);
    cy.url().should("include", "/MyPodcasts");
    cy.get("[data-cy=podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa").click();
    cy.get("[data-cy=podcast-image-f2-legends").click();
    cy.contains("This is a very long episo");
  });

  //If a podcast is deleted, all episdoes associated to that podcast should be too
  it("Should detele all episodes if a podcast is deleted", () => {
    cy.podcast_create(
      paths.bunny,
      "Cool pets",
      "A podcast about pets and their coolness.",
    );
    cy.url().should("include", "/CreatorHub/AddEpisode");
    cy.contains("Cool pets").should("be.visible");;
    cy.episode_create(
      paths.shiba,
      "Funny Shibas",
      "Silly dogs",
      paths.never_gonna_give_you_up,
      "pets",
    );
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.url().should("include", "/MyPodcasts");
    cy.episode_create(
      paths.cat,
      "Funny Cats",
      "Silly cats",
      paths.never_gonna_give_you_up,
      "pets", //s
    );
    cy.get("button").contains("Finish").click({ timeout: 5000 });
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.get("[data-cy=podcast-image-f2-legends").click({timeout: 5000});
    cy.wait(150);
    cy.get("[data-cy=podcast-image-cool-pets").click({timeout: 5000});
    cy.contains("Funny Cats").should("be.visible");
    cy.contains("Silly cats").should("be.visible");;
    cy.get('[data-cy="podcast-delete"]').should('exist').click({timeout: 5000});
    cy.contains("Button", "Delete").should('exist').click( {timeout: 5000} );
    cy.url().should("include", "/CreatorHub/MyPodcasts");
    cy.get('[data-cy="podcast-image-cool-pets"]').should("not.exist");
    cy.get("Funny cats").should("not.exist");
    cy.get("Funny Shibas").should("not.exist");
  });
});
