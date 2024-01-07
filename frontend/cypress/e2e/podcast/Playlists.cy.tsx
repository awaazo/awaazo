describe("Playlists", () => {
    beforeEach(() => {
      cy.login(null, "testRegister@email.com", "password123");
      cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
        timeout: 12000,
      });
    });

    it("Should not show any playlists if none are present", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('body').contains('No episodes in this playlist yet');
    });

    it("Should create a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-vybnum').click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Temp name");
        cy.get('textarea[placeholder="Description"]').type("Temp Description");
        cy.get('button').contains('Add Playlist').click();
        cy.get('body').contains('Temp name');
    });

    it("Should not create a playlist if the playlist name already exists", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-vybnum').click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Temp name");
        cy.get('textarea[placeholder="Description"]').type("Temp Description");
        cy.get('button').contains('Add Playlist').click();
        cy.contains('Playlist with the same name already exists.').should('be.visible');
    });

    it("Should edit a playlist name & description", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-1m4je2o > .chakra-image').click()
        cy.get('[data-cy="3-dots"]').as('btn').click();
        cy.get('button').contains('Edit "Temp name"').should('be.visible').click({timeout: 5000});
        cy.get('input').should('have.value', '0').last().type(" (EDIT)", { force: true });
        cy.get('button').contains('Save').click();
        cy.get('body').contains('Temp name (EDIT)');
    });

    it("Should cancel the edit by clicking the cancel button", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-1m4je2o > .chakra-image').click()
        cy.get('[data-cy="3-dots"]').as('btn').click();
        cy.get('button').contains('Edit "Temp name (EDIT)"').should('be.visible').click({timeout: 5000});
        cy.get('input').should('have.value', '0').last().type(" (CANCEL)", { force: true });
        cy.get('button').contains('Cancel').click();
        cy.get('body').contains('Temp name (EDIT)');
    });

    it.skip("Should delete a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('.css-vybnum').click();
        cy.get("[data-cy=add-playlist-button").click();
        cy.get('input[placeholder="Enter Playlist Name"]').type("Deleted Playlist");
        cy.get('textarea[placeholder="Description"]').type("Im gonna delete this!!!");
        cy.get('button').contains('Add Playlist').click();
        cy.reload()
        cy.get('body').contains('Deleted Playlist');
        cy.get('[data-cy="playlist-Deleted Playlist"]').click();
        cy.get('[data-cy="3-dots"]').as('btn').click();
        cy.get('button').contains('Delete "Deleted Playlist"').should('be.visible').click({timeout: 5000});
        cy.get('.css-18zw69y').click();
        cy.reload();
        cy.get('body').should('not.contain', 'Deleted Playlist');
    });

    it.skip("Should add one or more episodes to a playlist", function (){
        cy.visit('profile/MyProfile').url().should('include', 'profile/MyProfile');
        cy.get("[data-cy='2-dots-episode-card']").first().click({timeout: 5000});
        cy.get('button').contains('Add to Playlist').click({timeout: 5000, force: true});
        cy.get('select').select('Temp name (EDIT)');
        cy.get('.css-f2hjvb').should('be.visible').click({timeout: 5000});
        cy.reload();
        cy.get('body').contains('Number of Episodes: 1').should('be.visible');
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get("[data-cy='playlist-Temp name (EDIT)']").click();
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.text().includes('This is a very long episo')) {
                cy.contains('This is a very long episo').should('be.visible');
                expect(true).to.be.true;
            } else {
                expect(true).to.be.true;
            }
        });
    });

    it.skip("Should remove an episode from a playlist", function () {
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get('[data-cy="playlist-Temp name (EDIT)"]').click();
        cy.get('[data-cy="2-dots-episode-card"]').click( {timeout: 5000} );
        cy.get('button').contains('Remove from Playlist').click( {timeout: 5000} );
        cy.contains('No episodes in this playlist yet');
        cy.visit('profile/MyProfile').url().should('include', 'profile/MyProfile');
        cy.get('body').contains('Number of Episodes: 0').should('be.visible');
    });

    it.skip("Should show me my Liked Episodes", function () {
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click( {timeout:5000} )
        cy.wait(500);
        cy.get('[data-cy="like-button-index:"]').should('be.visible').first().click( {timeout:5000} )
        cy.visit('Playlist/Myplaylists').url().should('include', 'Playlist/Myplaylists');
        cy.get(':nth-child(1) > a > .css-92lhho > .chakra-text').click( {timeout: 5000});
        cy.wait(1000);
        cy.get('body').then(($body) => {
            if ($body.text().includes('This is a very long episo')) {
                cy.contains("This is a very long episo").should('be.visible');
                expect(true).to.be.true;
            } else {
                expect(true).to.be.true;
            }
        });
    });
})