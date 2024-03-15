import * as paths from '../../../fixtures/file_paths.json';

describe('Section', () => {
    
    beforeEach(() => {
        cy.console_error_hack();
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
    });

    it('Should create a podcast and an episode', () => {
        cy.console_error_hack();
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

    it('Should successfully create a Section', ()  => {
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="add-sections-button"').click( {timeout:5000} );
        cy.wait(250);
        cy.get('[data-cy="section-title-input"]').type('Section 1', {timeout: 5000}); 
        cy.wait(250);
        cy.get('[data-cy="sections-play-pause"').click( {timeout:5000} );
        cy.wait(1000);
        for (let i = 0; i < 30; i++) {
            cy.get('body').type('{rightarrow}');
        }
        cy.get('[data-cy="sections-play-pause"').click( {timeout:5000} );
        cy.wait(250);
        cy.get('[data-cy="set-end-time-button"').click( {timeout:5000} );
        cy.wait(250);
        cy.get('[data-cy="add-section-button-form"').click( {timeout:5000} );
        cy.wait(1000);
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.wait(500);
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Section 1').should('exist');
    });

    it('Should successfully delete a Section', ()  => {
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="section-delete-btn"').click( {timeout:5000} );
        cy.wait(500);
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Section 1').should('not.exist');
    });

    it('Should not create a section if the End time is smaller than the Start time', ()  => {
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
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
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.get('[data-cy="add-sections-button"').click( {timeout:5000} );
        cy.get('[data-cy="section-title-input"]').type('Should cancel', {timeout: 5000});
        cy.get('[data-cy="cancel-button"').click( {timeout:5000} );
        cy.wait(500);
        cy.visit('/CreatorHub');
        cy.url().should('include', '/CreatorHub', { timeout: 5000 });
        cy.get('[data-cy="sections-button"]').first().click( {timeout: 5000} );
        cy.contains('Should cancel').should('not.exist');
    });

    it('Cleanup', () => {
        cy.logout();
        cy.cleanup();
    })
});  