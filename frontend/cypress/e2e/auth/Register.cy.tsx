import * as paths from '../../fixtures/file_paths.json';

describe('Register', () => {
    beforeEach(() => {
        cy.visit('/'); 
        cy.url().should('include', '/');
        cy.wait(250);
      });
 
    // Test successful registration from the main page
    it('Should Successfully Register & setup new User', function () {
        cy.register_user('testRegister@email.com', 'TestUsername', 'password123', 'password123', '2000-01-01');
        cy.setup_user(paths.profile_picture, 'TestDisplayName', 'TestDisplayBio');
        cy.url().should('include', '/');
        cy.visit('/profile/MyProfile');
        cy.contains('TestDisplayBio');
      });
      
    it('Should Successfully Register & should fail setup by leaving fields blank', function () {
        cy.register_user('testRegister1@email.com', 'TestUsername1', 'password123', 'password123', '2000-01-01');
        cy.setup_user(paths.profile_picture, '{selectall}{backspace}', '{selectall}{backspace}');
        cy.url().should('include', '/Setup');
        cy.contains('Avatar, Display Name and Bio Required.').should('exist');
    });


    // Test unsuccessful registration from the main page
    it('Should not Register new User with existing email', function () {;
        cy.register_user('testRegister@email.com', 'TestUsername', 'password123', 'password123', '2000-01-01');
        cy.url().should('include', '/auth/Signup');
        cy.contains('An Account with that Email and/or Username already exists. Please Login or use a different Email address.').should('be.visible');
    });

    // Test unsuccessful registration from the main page. Passwords do not match.
    it('Should not Register new User Passwords that do not match', function () {
        cy.register_user('testRegister@email.com', 'TestUsername', 'password123', 'password1234', '2000-01-01');
        cy.url().should('include', '/auth/Signup');
        cy.contains('Passwords do not match.').should('be.visible');
    });
    
    it('limits the number of characters in the input field', () => {
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Register').click();
        cy.get('input[id="username"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        cy.get('input[id="username"]').should('have.value', 'aaaaaaaaaaaaaaaaaaaaaaaaa');
    });

});