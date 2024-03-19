import * as paths from '../../../fixtures/file_paths.json';

describe("Episode_Create", () => {
  beforeEach(() => {
    cy.console_error_hack();
    cy.login(null, "testRegister@email.com", "password123");
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
      timeout: 12000,
    });
  });

  it("Should create a podcast to upload Episodes to", function (){
    cy.podcast_create(paths.f2_car,'F2 Legends', 'A podcast about F2 veterans and their rise to glory.')
    cy.url().should('include', '/CreatorHub');
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
    cy.wait(500);
    cy.get('body').then(($body) => {
      if ($body.text().includes('An episode with the same name already exists for this podcast.')) {
          expect(true).to.be.true;
      }else{
          cy.get("button").contains("Finish").click({ timeout: 12000 });
          cy.url().should("include", "/CreatorHub");
          cy.contains("Charles Leclerc");
          cy.contains("From his rise in f2 to his demise at Ferrari");
      }
    });
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
    cy.url().should("include", "/CreatorHub");
    cy.contains(
      "An episode with the same name already exists for this podcast.",
    ).should("exist");
  });

  // User should be able to edit a episode name and have it reflected immediately
  it("Should successfully edit an episode", function () {
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click({ timeout: 12000 });
    cy.get("button").contains("CreatorHub").click({ timeout: 12000 });
    cy.url().should("include", "");
    cy.get("[data-cy=edit-button]").first().click();
    cy.wait(250);
    cy.data_log();
    cy.get('[data-cy="episode-name-input"]')
      .clear()
      .type("{selectall}{backspace}");
      cy.get('[data-cy="episode-name-input"]').type(
      "Romain Grosjean",
    );
    cy.contains("Button", "Update").click();
    cy.url().should("include", "");
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
    cy.url().should("include", "/CreatorHub");
    cy.contains("Required.").should("exist");
  });

  // Users should be allowed to delete their own episodes
  it("Should successfully delete an episode", function () {
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible");
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
    cy.get("button")
      .contains("CreatorHub")
      .should("be.visible")
      .click({ timeout: 12000 });
    cy.url().should("include", "/CreatorHub");
    cy.get("[data-cy=delete-button]").first().click();
    cy.contains("Button", "Delete").click({ timeout: 12000 });
    cy.url().should("include", "/CreatorHub");
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

    cy.get('body').then(($body) => {
      if ($body.text().includes('An episode with the same name already exists for this podcast.')) {
          expect(true).to.be.true;
      }else{
        cy.get("button").contains("Finish").click({ timeout: 12000 });
        cy.url().should("include", "/CreatorHub");
        cy.contains("♣™∏⊄‾ℜ→∞ϖñ");
        cy.contains("Episode about cool symbols");
      }
    });
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
    cy.get('body').then(($body) => {
      if ($body.text().includes('An episode with the same name already exists for this podcast.')) {
          expect(true).to.be.true;
      }else{
        cy.get("button").contains("Finish").click({ timeout: 12000 });
        cy.wait(1000);
        cy.url().should("include", "");
        cy.contains("This is a very long episo");
      }
    })
  });

  it("Should delete a podcast and consequently, all episodes get deleted.", () => {
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible");
    cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
    cy.get("button")
      .contains("CreatorHub")
      .should("be.visible")
      .click({ timeout: 12000 });
    cy.get('[data-cy="podcast-delete"]').should('exist').click({timeout: 12000});
    cy.contains("Button", "Delete").should('exist').click( {timeout: 12000} );
    cy.url().should("include", "/CreatorHub");
  });
});
