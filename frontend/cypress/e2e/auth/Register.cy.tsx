describe('Register', () => {

    // Test successful registration from the main page
    it('Should Successfully Register new User', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Register').click();
        cy.get('input[id="email"]').type('testRegister@email.com');
        cy.get('input[id="username"]').type('TestUsername');
        cy.get('input[id="password"]').type('password123');
        cy.get('input[id="confirmPassword"]').type('password123');
        cy.get('input[id="date"]').click().type('2000-01-01');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/Setup');
    });

    // Test unsuccessful registration from the main page
    it('Should not Register new User with existing email', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Register').click();
        cy.get('input[id="email"]').type('testRegister@email.com');
        cy.get('input[id="username"]').type('TestUsername');
        cy.get('input[id="password"]').type('password123');
        cy.get('input[id="confirmPassword"]').type('password123');
        cy.get('input[id="date"]').click().type('2000-01-01');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/auth/Signup');
        cy.contains('An Account with that Email already exists. Please Login or use a different Email address.').should('be.visible');
    });

    // Test unsuccessful registration from the main page. Passwords do not match.
    it('Should not Register new User Passwords that do not match', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Register').click();
        cy.get('input[id="email"]').type('testNewRegister@email.com');
        cy.get('input[id="username"]').type('TestUsername');
        cy.get('input[id="password"]').type('password123');
        cy.get('input[id="confirmPassword"]').type('password1234');
        cy.get('input[id="date"]').click().type('2000-01-01');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/auth/Signup');
        cy.contains('Passwords do not match.').should('be.visible');
    });

});