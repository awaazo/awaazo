import * as paths from '../../fixtures/file_paths.json';

describe('Search', () => {
    
    beforeEach(() => {
        cy.console_error_hack();
    });

    it('Should create a podcast', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.podcast_create(paths.max_verstappen_cover,'F2 Legends', 'A podcast about F1 veterans and their rise to glory.')
        cy.episode_create(
            paths.Episode_cover,
            "Charles Leclerc",
            "Charles Leclerc",
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
    })

    

    //Ideal use case, search for a user & visit their profile
    it('Should search for a User and visit their profile', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('testUsername{enter}');
        cy.get('[data-cy="user-card-TestDisplayName"]').should('be.visible').click({ timeout: 5000 });
        cy.contains("@NewUsername").should('be.visible');
    });
    

    //Ideal use case, search for a user & view their uploaded podcasts
    it('Should search for a User and view a podcast from their profile', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('testUsername{enter}');
        cy.intercept("GET", "/profile/*").as("profile");
        cy.get('[data-cy="user-card-TestDisplayName"]').should('be.visible').click({ timeout: 5000 });
        cy.contains("@NewUsername").should('be.visible');
        cy.wait(400);
        cy.get('[data-cy="podcast-name:F2 Legends"').should('be.visible');
    });

    //Ideal use case, search for a podcast and view their episodes
    it('Should search for a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('f2{enter}');
        cy.get('[data-cy="podcast-name:F2 Legends"').should('be.visible');
    });

    it('Should search for a podcast Episode', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('Charles Leclerc{enter}');
        cy.wait(500);
        cy.contains('body', 'Charles Leclerc').should('exist');

    });

    //Should not return anything is the written input doesn't match anything
    it('Should return nothing if search does not match any user and/or podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[href="/Explore/Search"]').click();
        cy.get('.chakra-input__group > .chakra-input').should('be.visible').type('This doesnt exist{enter}');
        cy.contains("No Podcasts Found").should('be.visible');
        cy.contains("No Episodes Found").should('be.visible');
        cy.contains("No Users Found").should('be.visible');
    });

    it('Cleanup', function() {
        cy.cleanup();
    });
});