import * as paths from '../../../fixtures/file_paths.json';

describe('Comment', () => {

    beforeEach(() => {
        cy.console_error_hack();
    });

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
            } else {
                cy.get("button").contains("Finish").click({ timeout: 12000 });
            }
        })
    });

    it('Should comment a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="podcast-name:f2-legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(1000);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.get('textarea[placeholder="Add a comment..."]').should('be.visible').type("Is there an error in the title?");
        cy.get('button').contains('Add Comment').click( {timeout: 5000} )
        cy.contains('Is there an error in the title?');
        cy.visit('/').url().should('include', '/');
        cy.get('[data-cy="podcast-name:f2-legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(1000);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.contains("DummyUsername:");
        cy.contains("Is there an error in the title?");
    });

    it('Should reply to a comment on a Podcast', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('[data-cy="podcast-name:f2-legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(1000);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.get('Input[placeholder="Reply to this comment..."]').should('be.visible').first().type("No! I was testing stuff using Cypress!");
        cy.get('[data-cy="reply-button"]').should('be.visible').first().click();
        cy.get('.chakra-modal__close-btn').scrollIntoView().should('be.visible').click();
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.contains('No! I was testing stuff using Cypress!')
    });


    it('Should like a reply on a Podcast', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('[data-cy="podcast-name:f2-legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(1000);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250)
        cy.get('button[data-cy^="like-button-index:"]').last().click();
    });

    it('Should delete a comment on a Podcast and consequently, delete all replies to said comment', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="podcast-name:f2-legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(1000);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.get('[data-cy="delete-comment-id:"]').should('be.visible').first().click({ timeout: 5000 })
        cy.should('not.contain', 'No! I was testing stuff using Cypress!')
    })

    it('Cleanup', () => {
        cy.cleanup();
    });
});

//Ignore
// cy.get('button[data-cy^="like-button-index:"]').each(($button, index) => {
        //     const buttonId = $button.attr('data-cy').replace('like-button-index:', '');
        //     const concatenatedId = buttonId + index;
        //     if (concatenatedId === "4") {
        //         cy.wrap($button).click();
        //     }
        // });