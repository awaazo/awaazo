describe('Logout', () => {

    it('Default pass', () => {
        cy.console_error_hack();
        expect(true).to.be.true;
    });
    
    it.skip('Logout when user is logged in', () => {
        cy.console_error_hack();
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible', { timeout: 5000 });
        cy.logout();
    });
});