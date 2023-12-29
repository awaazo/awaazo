import * as paths from "../../fixtures/file_paths.json";

describe("Notification", () => { 

    it('Should subscribe to a Podcast', () => {
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('f2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 });
        cy.get("button").contains("Subscribe").click();
        cy.get("button").contains("Unsubscribe").should('exist');
    });

    it('Should see no new notifications if there is nothing to be notified of', () => {
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.console_error_hack();
        cy.get('[data-cy="notifications-button"]').should('be.visible').click( {timeout: 5000} );
        cy.get('.css-ndlb3l > .chakra-text').contains('0').should('be.visible');
    });

    it('Should see a new notifications if an episode gets uploaded to', () => {
        cy.login(null, "testRegister@email.com", "password123");
        cy.wait(250);
        cy.episode_create(
            paths.angry,
            "Notifications",
            "I hate notifications!!!",
            paths.never_gonna_give_you_up,
            "f2",
          );
        cy.get("button").contains("Finish").click({ timeout: 5000 });
        cy.wait(750);
        cy.logout();
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
            });
        cy.console_error_hack();
        cy.get('[data-cy="notifications-button"]').should('be.visible').click( {timeout: 5000} );
        cy.get('.css-ndlb3l > .chakra-text').contains('1').should('be.visible');
    });

    it('Should unsubscribe from a podcast', () => {
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('f2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 });
        cy.get("button").contains("Unsubscribe").click();
        cy.get("button").contains("Subscribe").should('exist');
    });
});