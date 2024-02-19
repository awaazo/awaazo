import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Test', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.visit('/');
        });

        it('Should Successfully Login with email', function () {
            cy.login(null, 'mobileRegister@email.com', 'password123');
          });
        
          it('Should Successfully Login with username', function () {
            cy.login('MobileUsername', null, 'password123');
          });
        
          it('Should Fail to Login', function () {
            cy.login(null, 'testRegisterWRONG@email.com', 'password123');
            cy.url().should('include', '/auth/Login');
            cy.contains('Login failed. Invalid Email/Username and/or Password.');
            cy.visit('/');
            cy.login('WRONGtestUsername', null, 'password123');
            cy.url().should('include', '/auth/Login');
            cy.contains('Login failed. Invalid Email/Username and/or Password.');
          });
    }); 
});