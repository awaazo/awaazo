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


/*
  -=-=-=-=Auth Commands
*/
Cypress.Commands.add('login', (username, email, password) => {
  cy.visit('/');
  cy.url().should('include', '/');
  cy.wait(250);
  cy.get('button[aria-label="Menu"]').click();
  cy.get('button').contains('Login').click();
  if (email) {
    cy.get('input[id="email"]').type(email);
  }
  if (username) {
    cy.get('input[id="email"]').type(username);
  }
  cy.get('input[id="password"]').type(password);
  cy.get('button[id="loginBtn"]').click();
  cy.url().should('include', '/');
  cy.wait(500);
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  cy.url().should('include', '/');
  cy.wait(250);
  cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
  cy.get('button[aria-label="loggedInMenu"]').click();
  cy.get('button').contains('Logout').click();
  cy.url().should('include', '/');
});
/*
  -=-=-=-=End Auth Commands
*/

/*
  -=-=-=-=Registration Commands
*/
Cypress.Commands.add('register_user', (email, username, password, confirmPassword, birthdate) => {
  cy.get('button[aria-label="Menu"]').click();
  cy.get('button').contains('Register').click();
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="password"]').type(password)
  cy.get('input[id="confirmPassword"]').type(confirmPassword);
  cy.get('input[id="date"]').click().type(birthdate);
  cy.get('button[type="submit"]').click();
  cy.wait(250);
});

Cypress.Commands.add('setup_user', (filepath, displayName, bio) => {
  cy.url().should('include', '/Setup');
  cy.get('input[type="file"]').attachFile(filepath);
  cy.get('input[id="displayName"]').type(displayName);
  cy.get('Textarea[id="bio"]').type(bio);
  cy.get(':nth-child(16) > .chakra-button').click();
  cy.get(':nth-child(7) > .chakra-button').click();
  cy.get(':nth-child(10) > .chakra-button').click();
  cy.get('button[type="submit"]').click();
});
/*
  -=-=-=-=End Registration Commands
*/


Cypress.Commands.add('edit_profile', (filepath, username, bio, twitterURL, linkedInURL, githubURL) => {
  cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
  cy.get('button[aria-label="loggedInMenu"]').click();
  cy.wait(250);
  cy.contains('button', 'My Account', {timeout: 5000}).then(($btn) => {
    if ($btn) {
      $btn.click();
    }
  }).then(($btn) => {
    if (!$btn) {
      cy.get('button[aria-label="loggedInMenu"]').click();
    }
  });
  cy.get('button').contains('Edit Profile').click();
  if (filepath) {
    cy.get('input[type="file"]').attachFile(filepath);
  }
  if (username) {
    cy.get('input#username').clear().type(username);
  }
  if (bio) {
    cy.get('textarea#bio').clear().type(bio);
  }
  cy.get(':nth-child(16) > .chakra-button').click();
  cy.get(':nth-child(7) > .chakra-button').click();
  cy.get(':nth-child(10) > .chakra-button').click();
  if (twitterURL) {
    cy.get('input[placeholder="Twitter URL"]').clear().type(twitterURL);
  }
  if (linkedInURL) {
    cy.get('input[placeholder="LinkedIn URL"]').clear().type(linkedInURL);
  }
  if (githubURL) {
    cy.get('input[placeholder="GitHub URL"]').clear().type(githubURL);
  }
  cy.get('button').contains('Update Profile').click();
  cy.wait(250);
  
});

Cypress.Commands.add('podcast_create', (filepath, name, description) => {
  cy.get('button[aria-label="Create"]').click();
  cy.url().should('include', '/Create');
  cy.get('[data-cy="create-podcast-box"]').click();
  cy.url().should('include', '/NewPodcast');
  cy.wait(250);
  cy.get('input[type="file"]').attachFile(filepath);
  cy.wait(250);
  if (name) {
    cy.get('input[id="podcastName"]').type(name);
  }
  if (description) {
    cy.get('textarea[id="description"]').type(description);
  }
  cy.get(':nth-child(5) > .chakra-button').click();
  cy.get(':nth-child(7) > .chakra-button').click();
  cy.get(':nth-child(10) > .chakra-button').click();
  cy.get('button[id=createBtn]').click(); 
});


Cypress.Commands.add('console_error_hack', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
})

Cypress.Commands.add('data_log', () => {
  cy.get('[data-cy]').then(($elements) => {
    $elements.each((index, element) => {
      cy.log(`Element ${index + 1}: ${Cypress.$(element).attr('data-cy')}`);
    });
  });
})



/*
Ignore please
cy.contains('Avatar, Display Name and Bio Required.').should('exist').then(() => {
          }).then(() => {
            cy.contains('Avatar, Display Name and Bio Required.').should('exist');
          });
*/