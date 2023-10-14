describe('Login', () => {

  it('Should Successfully Login', function () {
    cy.visit('/');
    cy.url().should('include', '/');
    cy.wait(500);
    cy.get('button[aria-label="Menu"]').click();
    cy.get('button').contains('Login').click();
    cy.get('input[id="email"]').type("testRegister@email.com");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[id="loginBtn"]').click();
    cy.url().should('include', '/Main');
  });

  it('Should Fail to Login', function () {
    cy.visit('/');
    cy.url().should('include', '/');
    cy.wait(500);
    cy.get('button[aria-label="Menu"]').click();
    cy.get('button').contains('Login').click();
    cy.get('input[id="email"]').type("testRegisterWRONG@email.com");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[id="loginBtn"]').click();
    cy.url().should('include', '/auth/Login');
    cy.contains('Login failed. Invalid Email and/or Password.');

    cy.get('input[id="email"]').clear();
    cy.get('input[id="password"]').clear();
    
    cy.get('input[id="email"]').type("testRegister@email.com");
    cy.get('input[id="password"]').type("password123WRONG");
    cy.get('button[id="loginBtn"]').click();
    cy.url().should('include', '/auth/Login');
    cy.contains('Login failed. Invalid Email and/or Password.');
  });


})