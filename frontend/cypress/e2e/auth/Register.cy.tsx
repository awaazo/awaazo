describe('Register', () => {

    beforeEach(() => {
        cy.visit('/'); // Replace with the URL of your application
      });

    // Test successful registration from the main page
    it('Should Successfully Register & setup new User', function () {
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
        cy.wait(500);
        cy.url().should('include', '/Setup');
        const filepath = 'images/display_picture.png';
        cy.get('input[type="file"]').attachFile(filepath);
        cy.get('input[id="displayName"]').type('TestDisplayName');
        cy.get('Textarea[id="bio"]').type('TestDisplayBio');
        cy.get(':nth-child(16) > .chakra-button').click();
        cy.get(':nth-child(7) > .chakra-button').click();
        cy.get(':nth-child(10) > .chakra-button').click();
        cy.get('button[type="submit"]').click();
        cy.wait(500);
        cy.url().should('include', '/');
        cy.visit('/profile/MyProfile');
        cy.wait(500);
        cy.contains('TestDisplayBio');
      });
      
      it('Should Successfully Register & should fail setup by leaving fields blank', function () {
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="Menu"]').should('be.visible');
        cy.get('button[aria-label="Menu"]').click();
        cy.wait(500);
        cy.get('button').contains('Register').click();
        cy.get('input[id="email"]').type('testRegister1@email.com');
        cy.get('input[id="username"]').type('TestUsername1');
        cy.get('input[id="password"]').type('password123');
        cy.get('input[id="confirmPassword"]').type('password123');
        cy.get('input[id="date"]').click().type('2000-01-01');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/Setup');
        const filepath = 'images/display_picture.png';
        cy.get('input[type="file"]').attachFile(filepath);
        cy.get('input[id="displayName"]').clear().type(' {selectall}{backspace}');
        cy.get('Textarea[id="bio"]').clear().type(' {selectall}{backspace}');
        cy.get('button[type="submit"]').click();
        cy.wait(500);
        cy.url().should('include', '/Setup');
        cy.wait(500);
        cy.contains('Avatar, Display Name and Bio Required.').should('exist').then(() => {
            }).then(() => {
            cy.contains('Avatar, Display Name and Bio Required.').should('exist');
        });
      });


    // Test unsuccessful registration from the main page
    it('Should not Register new User with existing email', function () {
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
        cy.contains('An Account with that Email and/or Username already exists. Please Login or use a different Email address.').should('be.visible');
    });

    // Test unsuccessful registration from the main page. Passwords do not match.
    it('Should not Register new User Passwords that do not match', function () {
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

    
    
      it('limits the number of characters in the input field', () => {
        cy.url().should('include', '/');
        cy.wait(500);
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains('Register').click();
        cy.get('input[id="username"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        cy.get('input[id="username"]').should('have.value', 'aaaaaaaaaaaaaaaaaaaaaaaaa');
      });

});