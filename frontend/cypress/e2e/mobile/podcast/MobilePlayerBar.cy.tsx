import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Playerbar', () => {
    context('Mobile resolution', () => {
        beforeEach(() => {
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.login(null, 'mobileRegister@email.com', 'password123');
            cy.wait(750);
        });
        it('Should create a podcast and upload an episode for mobile playerbar testing', () => {
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

        it.only('Should test the functionality of the play/pause button', () => {
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
                timeout: 5000,
            });
            cy.get('[data-cy="ticket-episode-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
            cy.get('[data-cy="play-pause-button"]').should('be.visible').click({ timeout: 5000 });
            cy.wait(2500);
            cy.data_log();
            cy.get('[data-cy="play-pause-button"]').should('be.visible').click({ timeout: 5000 });
        });

        it('Should test the functionality of the play/pause button', () => {
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
                timeout: 5000,
            });
            cy.get('[data-cy="ticket-episode-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
            cy.get('[data-cy="play-pause-button"]').should('be.visible').click({ timeout: 5000 });
            cy.wait(10500);
            cy.data_log();
            cy.get('[data-cy="play-pause-button"]').should('be.visible').click({ timeout: 5000 });
        });

        it.only('Should test functioanlity of skip forward and backward button', () => {
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
            timeout: 5000,
            });
            cy.get('[data-cy="ticket-episode-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
            cy.get('[data-cy="play-previous"]').should('be.visible').click({timeout : 5000});
            cy.wait(500);
            cy.get('[data-cy="skip-backward"]').should('be.visible').click({timeout : 5000});
            cy.wait(300);
            cy.get('[data-cy="skip-forward"]').should('be.visible').click({timeout : 5000});
        });
    });
});