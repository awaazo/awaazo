describe('Section', () => {
    
    beforeEach(() => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible', { timeout: 5000 });
    });

    it('Should delete a Podcast', () => {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.data_log();
        cy.get('[data-cy=podcast-image-f2-legends').click();
        cy.get('[data-cy="podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa"]').click();
        cy.get('[data-cy=podcast-delete').click();
        cy.contains('Button', 'Delete').click();
        cy.url().should('include', '/MyPodcasts');
        cy.contains('aaaaaaaaaaaaaaaaaaaaaaaaa').should('not.exist');
    });

    it('Should successfully create a Section', ()  => {
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="add-sections-button"').click( {timeout:5000} );
        cy.get('[data-cy="section-title-input"]').type('Section 1', {timeout: 5000});
        cy.get('[data-cy="sections-play-pause"').click( {timeout:5000} );
        cy.wait(1000);
        cy.get('[data-cy="sections-play-pause"').click( {timeout:5000} );
        for (let i = 0; i < 30; i++) {
            cy.get('body').type('{rightarrow}');
        }
        cy.get('[data-cy="set-end-time-button"').click( {timeout:5000} );
        cy.get('[data-cy="add-section-button-form"').click( {timeout:5000} );
        cy.wait(500);
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Section 1').should('exist');
    });

    it('Should successfully delete a Section', ()  => {
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="section-delete-btn"').click( {timeout:5000} );
        cy.wait(500);
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Section 1').should('not.exist');
    });

    it('Should not create a section if the End time is smaller than the Start time', ()  => {
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="add-sections-button"').click( {timeout:5000} );
        cy.get('[data-cy="section-title-input"]').type('Should fail', {timeout: 5000});
        cy.get('[data-cy="add-section-button-form"').click( {timeout:5000} );
        cy.wait(500);
        cy.contains(
            "Start Value Should always be greater then End value",
          ).should("exist");
    });

    it('Should cancel creating the Section', ()  => {
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="add-sections-button"').click( {timeout:5000} );
        cy.get('[data-cy="section-title-input"]').type('Should cancel', {timeout: 5000});
        cy.get('[data-cy="cancel-button"').click( {timeout:5000} );
        cy.wait(500);
        cy.visit('/CreatorHub/MyPodcasts');
        cy.url().should('include', '/CreatorHub/MyPodcasts', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Should cancel').should('not.exist');
    });
});  