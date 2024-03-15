import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Logout', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.visit('/');
        });
        
        it('Logout on mobile', () => {
            cy.console_error_hack();
            cy.login(null, 'mobileRegister@email.com', 'password123');
            cy.get('button[aria-label="loggedInMenu"]').should('be.visible', { timeout: 5000 });
            cy.logout();
        });
        
    }); 
});