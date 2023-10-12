describe('Login', () => {
  
  // Test Setup
  const loginPageLink = 'http://localhost:3000/auth/Login';
  const homePageLink = 'http://localhost:3000/';

  it('Should show login from homepage', () => {
    cy.visit(homePageLink)
    cy.contains('Welcome Back')
    cy.get('button').contains('Login').click()
    cy.url().should('include', '/auth/Login')
  })
  
  it('Should render the login page', () => {
    cy.visit(loginPageLink)
    cy.contains('Welcome Back')
    
  })

  it('Should not login with no input', () => {
    cy.visit(loginPageLink)
    cy.get('button').contains('Login').click()
    cy.url().should('include', '/auth/Login')
  })

  it('Should not login with invalid email', () => {
    cy.visit(loginPageLink)
    cy.get('input[type=email]').type('XXXXXXXXXXXXX')
    cy.get('input[type=password]').type('test')
    cy.get('button').contains('Login').click()
    cy.url().should('include', '/auth/Login')
  })

  it('should display login failed', () => {
    cy.visit(loginPageLink)
    cy.get('input[type=email]').type('testWrong@gmail.com')
    cy.get('input[type=password]').type('test')
    cy.get('button').contains('Login').click()
    cy.contains('Login failed. Invalid Email and/or Password.')
    cy.url().should('include', '/auth/Login')
  })

  it('should login successfully', () => {
    cy.visit(loginPageLink)
    cy.get('input[type=email]').type('a@a')
    cy.get('input[type=password]').type('a')
    cy.get('button').contains('Login').click()
    cy.url().should('include', '/')
  })


})