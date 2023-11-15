describe('Login', () => {

  it('Should Successfully Login with email', function () {
    cy.visit('/');
    cy.url().should('include', '/');
    cy.wait(500);
    cy.get('button[aria-label="Menu"]').click();
    cy.get('button').contains('Login').click();
    cy.get('input[id="email"]').type("testRegister@email.com");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[id="loginBtn"]').click();
    cy.url().should('include', '/');
  });

  it('Should Successfully Login with username', function () {
    cy.visit('/');
    cy.url().should('include', '/');
    cy.wait(500);
    cy.get('button[aria-label="Menu"]').click();
    cy.get('button').contains('Login').click();
    cy.get('input[id="email"]').type("TestUsername");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[id="loginBtn"]').click();
    cy.url().should('include', '/');
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
    cy.contains('Login failed. Invalid Email/Username and/or Password.');
  });


})