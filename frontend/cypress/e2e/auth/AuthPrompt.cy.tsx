import * as paths from '../../fixtures/file_paths.json';

describe('AuthPrompt', () => {

  beforeEach(() => {
    cy.console_error_hack();
  });

  it('Should create a podcast and upload an episode for LoginPrompt testing', () => {
    cy.login(null, "testRegister@email.com", "password123");
    cy.podcast_create(paths.max_verstappen_cover, 'f2-legends', 'A podcast about F1 veterans and their rise to glory.')
    cy.episode_create(
      paths.Episode_cover,
      "Has science gone too far?",
      "OMG is that Gabe?",
      paths.never_gonna_give_you_up,
      "f2",
    );
    cy.wait(500);
    cy.get('body').then(($body) => {
      if ($body.text().includes('An episode with the same name already exists for this podcast.')) {
        expect(true).to.be.true;
      } else {
        cy.get("button").contains("Finish").click({ timeout: 12000 });
      }
    })
  });

  it('Should prompt user to Login when the Like button is clicked', function () {
    cy.visit("/");
    cy.get('[data-cy="like-button-index:"]').click({ timeout: 5000 });
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Comment button is clicked', function () {
    cy.visit("/");
    cy.get('[data-cy="playerbar-comment-button"]').click({ timeout: 5000 });
    cy.get('.chakra-textarea').type("I need to login!!");
    cy.get('button').contains("Add Comment").click({ timeout: 5000 });
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Subscribe button is clicked', function () {
    cy.visit("/");
    cy.get('[data-cy="podcast-name:f2-legends"]').click({timeout: 5000});
    cy.get('button').contains("Subscribe").click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the ChatBot button is clicked', function () {
    cy.visit("/");
    cy.get('.css-d6eevf').click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Add Review button is clicked', function () {
    cy.visit("/");
    cy.get('[data-cy="podcast-name:f2-legends"]').click({timeout: 5000});
    cy.get('button').contains("Add Your Review").click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Add Bookmark button is clicked', function () {
    cy.visit("/");
    cy.get('.css-1spp23z').click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Create Playlist button is clicked', function () {
    cy.visit("/");
    cy.get('[data-cy="playlist-icon"]').click( {timeout: 5000} );
    cy.get('[data-cy="add-playlist-button"]').click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when the Add Bookmark button is clicked', function () {
    cy.visit("/");
    cy.data_log();
    cy.get('[data-cy="podcast-name:f2-legends"]').click({timeout: 5000});
    cy.get('[data-cy="2-dots-episode-card"]').click({timeout: 5000});
    cy.get('button').contains('Add to Playlist').click( {timeout: 5000} );
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should prompt user to Login when visiting member-only pages', function () {
    cy.visit("/");
    cy.visit("/Notifications/MyNotifications"); //Notifications
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
    cy.visit("/CreatorHub"); //Creatorhub
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
    cy.visit("/profile/MyProfile"); //MyProfile
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
    cy.visit("/profile/EditProfile"); //EditProfile
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
    cy.visit("/profile/ProfileSetup"); //Profile Setup
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
    cy.visit("/Playlist"); //Profile Setup
    cy.get('body', { timeout: 10000 }).contains('Login to Awaazo');
  });

  it('Should cleanup', function () {
    cy.cleanup();
  });
})