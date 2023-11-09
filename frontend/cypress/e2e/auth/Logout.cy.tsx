describe('Logout', () => {

    it('Logout when user is logged in', () => {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Login').click();
        cy.get('input[id="email"]').type("testRegister@email.com");
        cy.get('input[id="password"]').type("password123");
        cy.get('button[id="loginBtn"]').click();
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.wait(500);
        cy.get('button').contains('Logout').click();
        cy.url().should('include', '/');
    });

});