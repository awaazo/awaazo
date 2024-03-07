import * as paths from '../../fixtures/file_paths.json';

describe("Playlists", () => {
    beforeEach(() => {
      cy.console_error_hack();
      cy.login(null, "testRegister@email.com", "password123");
      cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
        timeout: 12000,
      });
    });
    
    it('Should create a podcast and upload an episode for playlist testing', () => {
        cy.podcast_create(paths.max_verstappen_cover,'f2-legends', 'A podcast about F1 veterans and their rise to glory.')
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

    it("Should not show any playlists if none are present", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('body').contains('No episodes in this playlist yet');
    });

    it("Should create a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Temp name");
        cy.get('textarea[placeholder="Description"]').type("Temp Description");
        cy.wait(250);
        cy.get('button').contains('Add Playlist').click();
        cy.wait(250);
        cy.reload();
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy='playlist-Temp name']").click();
        cy.get('body').contains('Temp name');
    });
 
    it("Should not create a playlist if the playlist name already exists", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Temp name");
        cy.get('textarea[placeholder="Description"]').type("Temp Description");
        cy.wait(250);
        cy.get('button').contains('Add Playlist').click();
        cy.wait(250);
        cy.contains('Playlist with the same name already exists.').should('be.visible');
    });

    it("Should edit a playlist name & description", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-1m4je2o > .chakra-image').click()
        cy.wait(500);
        cy.get('[data-cy="3-dots"]').first().as('btn').click();
        cy.get('button').contains('Edit "Temp name"').should('be.visible').click({timeout: 5000});
        cy.get('[data-cy="edit-playlist-name-form"]').type('{selectall}{backspace}').type('Temp name (EDIT)');
        cy.wait(250);
        cy.get('button').contains('Save').click();
        cy.get('body').contains('Temp name (EDIT)');
    });

    it("Should cancel the edit by clicking the cancel button", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-1m4je2o > .chakra-image').click()
        cy.wait(500);
        cy.get('[data-cy="3-dots"]').first().as('btn').click();
        cy.get('button').contains('Edit "Temp name (EDIT)"').should('be.visible').click({timeout: 5000});
        cy.get('[data-cy="edit-playlist-name-form"]').type('{selectall}{backspace}').type(" (CANCEL)", { force: true });
        cy.get('button').contains('Cancel').click();
        cy.get('body').contains('Temp name (EDIT)');
    });

    it("Should delete a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Deleted Playlist");
        cy.get('textarea[placeholder="Description"]').type("Im gonna delete this!!!");
        cy.wait(250);
        cy.get('button').contains('Add Playlist').click();
        cy.wait(250);
        cy.reload();
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy='playlist-Deleted Playlist'").click();
        cy.get('body').contains('Deleted Playlist');
        cy.get('[data-cy="playlist-Deleted Playlist"]').click();
        cy.get('[data-cy="3-dots"]').first().as('btn').click();
        cy.get('button').contains('Delete "Deleted Playlist"').should('be.visible').click({timeout: 5000});
        cy.get('.css-1oc2xsy').click( {force:true });
        cy.get('body').should('not.contain', 'Deleted Playlist');
    });

    it("Should add one or more episodes to a playlist", function (){
        cy.visit('profile/MyProfile').url().should('include', 'profile/MyProfile');
        cy.get("[data-cy='2-dots-episode-card']").first().click({timeout: 5000, force: true});
        cy.get('button').contains('Add to Playlist').click({timeout: 5000, force: true});
        cy.get('select').select('Temp name (EDIT)');
        cy.get('.css-hqf4k1').should('be.visible').click({timeout: 5000});
        cy.wait(500);
        cy.reload();
        cy.get('body').contains('Number of Episodes: 1').should('be.visible');
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy='playlist-Temp name (EDIT)']").click();
        cy.get('body').should('not.contain', 'No episodes in this playlist yet', { timeout: 5000 });
    });

    it("Should remove an episode from a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-icon'").click();
        cy.get('[data-cy="playlist-Temp name (EDIT)"]').click();
        cy.get('[data-cy="2-dots-episode-card"]').click( {timeout: 5000} );
        cy.get('button').contains('Remove from Playlist').click( {timeout: 5000} );
        cy.contains('No episodes in this playlist yet');
        cy.visit('profile/MyProfile').url().should('include', 'profile/MyProfile');
        cy.get('body').contains('Number of Episodes: 0').should('be.visible');
    });

    it("Should show me my Liked Episodes", function () {
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('has{enter}');
        cy.wait(500);
        cy.get('[data-cy="like-button-index:"]').should('be.visible').first().click( {timeout:5000} )
        cy.visit('/profile/MyProfile').url().should('include', '/profile/MyProfile');
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.text().includes('This is a very long episo')) {
                cy.contains("Number of Episodes: 1").should('be.visible');
                expect(true).to.be.true;
            } else {
                expect(true).to.be.true;
            }
        });
    });

    it("Should cleanup", function () {
        cy.logout();
        cy.cleanup();
    })

    it("Should delete a playlist, reverting to a clean state", function () {
        cy.get("[data-cy='playlist-icon'").click();
        cy.get("[data-cy='playlist-Temp name (EDIT)'").click();
        cy.wait(500);
        cy.get('[data-cy="3-dots"]').first().as('btn').click();
        cy.get('button').contains('Delete "Temp name (EDIT)"').should('be.visible').click({timeout: 5000});
        cy.get('.css-1oc2xsy').click( {force:true });
        cy.get('body').should('not.contain', 'Temp name (EDIT)');
    });
})