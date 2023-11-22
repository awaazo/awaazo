describe('Logout', () => {

    it('Logout when user is logged in', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible', { timeout: 5000 });
        cy.logout();
    });
});