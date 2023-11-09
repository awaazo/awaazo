/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import 'cypress-file-upload';


  
Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.url().should('include', '/');
  cy.wait(500);
  cy.get('button[aria-label="Menu"]').click();
  cy.get('button').contains('Login').click();
  cy.wait(500);
  cy.get('input[id="email"]').type("testRegister@email.com");
  cy.get('input[id="password"]').type("password123");
  cy.get('button[id="loginBtn"]').click();
  cy.url().should('include', '/');
  cy.wait(1000);
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.url().should('include', '/');
  cy.wait(500);
  cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
  cy.wait(500);
  cy.get('button[aria-label="loggedInMenu"]').click();
  cy.wait(500);
  cy.get('button').contains('Logout').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('Quick_register', () => {
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
        cy.wait(500);
        cy.visit('/');
});

Cypress.Commands.add('console_error_hack', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
})