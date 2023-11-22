describe('Login', () => {

  it('Should Successfully Login with email', function () {
    cy.login(null, 'testRegister@email.com', 'password123');
  });

  it('Should Successfully Login with username', function () {
    cy.login('testUsername', null, 'password123');
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
})