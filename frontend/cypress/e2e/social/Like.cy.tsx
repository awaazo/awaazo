import * as paths from '../../fixtures/file_paths.json';

describe('Like', () => { 

    it('Should create a podcast and an episode', () => {
        cy.console_error_hack();
        cy.login(null, 'testRegister@email.com', 'password123');
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
            }else{
                cy.get("button").contains("Finish").click({ timeout: 12000 });
            }
        })
    });

    it('Should like a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('[data-cy="search-input"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-name:f2-legends"').should('be.visible').click( {timeout:5000} )
        cy.get('[data-cy="likes-on-Has science gone too far?-0"]').should('be.visible', { timeout: 5000 });
        cy.wait(250);
        cy.get('[data-cy="likes-on-Has science gone too far?-0"] > [data-cy="like-button-index:"]').should('be.visible').click( {timeout: 5000} );
        cy.visit('/').url().should('include', '/');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('[data-cy="search-input"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-name:f2-legends"').should('be.visible').click( {timeout:5000} )
        cy.wait(250);
        cy.get('[data-cy="likes-on-Has science gone too far?-1"]').should('be.visible', { timeout: 5000 });
    });

    it('Should unlike a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('[data-cy="search-input"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-name:f2-legends"').should('be.visible').click( {timeout:5000} )
        cy.get('[data-cy="likes-on-Has science gone too far?-1"]').should('be.visible', { timeout: 5000 });
        cy.wait(250);
        cy.get('[data-cy="likes-on-Has science gone too far?-1"] > [data-cy="like-button-index:"]').should('be.visible').click( {timeout: 5000} );
        cy.visit('/').url().should('include', '/');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('[data-cy="search-input"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-name:f2-legends"').should('be.visible').click( {timeout:5000} )
        cy.wait(250);
        cy.get('[data-cy="likes-on-Has science gone too far?-0"]').should('be.visible', { timeout: 5000 });
    });

    it('Cleanup', () => {
        cy.cleanup();
    })
});