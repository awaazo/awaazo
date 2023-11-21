describe('Logout', () => {

    it('Logout when user is logged in', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.logout();
    });
});