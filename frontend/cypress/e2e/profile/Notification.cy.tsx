import * as paths from "../../fixtures/file_paths.json";

describe("Notification", () => { 

    beforeEach(() => {
        cy.console_error_hack();
    });

    it('Should create a Podcast so I can get a notification', function () {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.podcast_create(paths.max_verstappen_cover, 'F2 Legends', 'A podcast about F1 veterans and their rise to glory.')
        cy.url().should('include', '/CreatorHub/MyPodcasts');
    });
    
    it('Should subscribe to a Podcast', () => {
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="podcast-name:F2 Legends"]').should('be.visible').click( {timeout:5000} )
        cy.get("button").contains("Subscribe").click();
        cy.get("button").contains("Unsubscribe").should('exist');
    });

    it('Should see no new notifications if there is nothing to be notified of', () => {
        cy.console_error_hack();
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('[data-cy="notifications-button"]').scrollIntoView().should('be.visible').click( {timeout: 5000} );
        cy.get('body').contains('There are no Notifications right now');
    });

    it('Should see a new notifications if an episode gets uploaded to', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password123");
        cy.wait(1000);
        cy.episode_create(
            paths.angry,
            "Notifications",
            "I hate notifications!!!",
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
        cy.wait(750);
        cy.logout();
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
            timeout: 5000,
            });
        cy.console_error_hack();
        cy.get('[data-cy="notifications-button"]').should('be.visible').click( {timeout: 5000} );
        cy.get('body').contains('New Episode added : Notifications');
    });

    it('Should unsubscribe from a podcast', () => {
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="podcast-name:F2 Legends"]').should('be.visible').click( {timeout:5000} )
        cy.get("button").contains("Unsubscribe").click();
        cy.get("button").contains("Subscribe").should('exist');
    });

    it('Cleanup', () => {
        cy.cleanup();
    })
});