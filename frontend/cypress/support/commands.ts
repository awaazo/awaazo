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
  cy.url().should('include', '/', { timeout: 5000 });
  cy.wait(250);
  cy.get('button[aria-label="Menu"]').click({ timeout: 5000 });
  cy.wait(250);
  cy.get('button').contains('Login').click({ timeout: 5000 });

  cy.visit('auth/Login');
  if (email) {
    cy.get('input[id="email"]').type(email);
  }
  if (username) {
    cy.get('input[id="email"]').type(username);
  }
  cy.get('input[id="password"]').type(password);
  cy.get('button[id="loginBtn"]').click();
  cy.url().should('include', '/', { timeout: 5000 });
});

Cypress.Commands.add('logout', () => {
  cy.console_error_hack();
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible');
  cy.get('span.css-xl71ch').click({ timeout: 5000, force: true });
  cy.get('button').contains('Logout').should('be.visible').click({timeout: 5000});
  cy.get('button[aria-label="Menu"]').scrollIntoView().should('be.visible');
  cy.url().should('include', '/');
});
/*
  -=-=-=-=End Auth Commands
*/

/*
  -=-=-=-=Registration Commands
*/
Cypress.Commands.add('register_user', (email, username, password, confirmPassword, birthdate) => {
  cy.get('[data-cy="navbar-hamburger"]').scrollIntoView().should('be.visible');
  cy.wait(250); // Wait for 1 second
  cy.get('[data-cy="navbar-hamburger"]').click({ timeout: 5000 });
  cy.get('button').contains('Sign up').should('be.visible').click({timeout: 5000});
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="password"]').type(password)
  cy.get('input[id="confirmPassword"]').type(confirmPassword);
  cy.get('input[id="date"]').click().type(birthdate);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('setup_user', (filepath, displayName, bio) => {
  cy.url().should('include', '/profile/ProfileSetup', { timeout: 5000 });
  cy.get('input[type="file"]').attachFile(filepath);
  cy.wait(250);
  cy.get('button').contains('Done').click();
  cy.wait(750);
  cy.get('input[id="displayName"]').type(displayName, { timeout: 12000 });
  cy.get('Textarea[id="bio"]').type(bio);
  cy.get(':nth-child(5) > .chakra-button').click();
  cy.get(':nth-child(7) > .chakra-button').click();
  cy.get(':nth-child(10) > .chakra-button').click();
  cy.get('button[type="submit"]').click();
});
/*
  -=-=-=-=End Registration Commands
*/


Cypress.Commands.add('edit_profile', (filepath, username, bio, twitterURL, linkedInURL, githubURL) => {
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible');
  cy.get('button[aria-label="loggedInMenu"]').click();
  cy.contains('button', 'My Account', {timeout: 5000}).then(($btn) => {
    if ($btn) {
      $btn.click();
    }
  }).then(($btn) => {
    if (!$btn) {
      cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
    }
  });
  cy.get('[data-cy=edit_profile_button').click();
  // if (filepath) {
  //   cy.get('input[type="file"]').attachFile(filepath);
  // }
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
});

Cypress.Commands.add('change_password', (old_pass, new_pass, confirm_pass) => {
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.contains('button', 'My Account', {timeout: 5000}).then(($btn) => {
            if ($btn) {
            $btn.click();
            }
        }).then(($btn) => {
            if (!$btn) {
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
            }
        });
        cy.get('[data-cy=edit_profile_button').click();
        cy.get('button').contains('Change Password').scrollIntoView().click( {timeout:5000} );
        cy.get('input[placeholder="Enter current password"').type(old_pass);
        cy.get('input[placeholder="Enter new password"').type(new_pass);
        cy.get('input[placeholder="Confirm new password"').type(confirm_pass);
        cy.get('.css-97dsq > form > .chakra-stack > .chakra-button').click( {timeout:5000} );
});

/*
-=-=-=-=-=-=-=Podcast create
*/
Cypress.Commands.add('podcast_create', (filepath, name, description) => {
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible');
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
  cy.wait(250);
  cy.get('button').contains('CreatorHub').click();
  cy.url().should('include', '/CreatorHub');
  cy.get('.css-1bdrd0f').click();
  cy.url().should('include', '/CreatorHub');
  cy.wait(250);
  cy.get('input[type="file"]').attachFile(filepath);
  cy.wait(250);
  cy.get('body').then(($body) => {
    if ($body.text().includes('Done')) {
      cy.wait(500);
      cy.get('button').contains('Done').click();
    }else{}})
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
  cy.wait(200);
  cy.get('body').then(($body) => {
    if ($body.text().includes('A podcast with the same name already exists')) {
        expect(true).to.be.true;
    }
  })
});
/*
-=-=-=-=-=-=-=End Podcast create
*/

Cypress.Commands.add('episode_create', (fjlepath, name, description, sound_file, podcast) =>{
  cy.visit('/CreatorHub');
  cy.wait(1000);
  cy.get('[data-cy="add-episode-tab"]').click({ timeout: 5000, force: true });
  cy.get('input[type="file"]').attachFile(fjlepath);
  cy.wait(500);
  cy.get('button').contains('Done').scrollIntoView().click({ timeout: 5000 });
  cy.wait(500);
  if(name){
    cy.get('input[placeholder="Enter episode name..."]', { timeout: 10000 }).type(name);
  }
  if(description){
    cy.get('textarea[placeholder="Enter episode description..."]').type(description);
  }
  cy.get('[data-cy="podcast-file-dropzone"]').should('be.visible').within(() => {
    cy.get('input[type="file"]').attachFile(sound_file);
  });
  cy.get('#createBtn').click({ timeout: 10000 });
  cy.intercept('GET', '/CreatorHub').as('podcasts');
});


Cypress.Commands.add('review_create', (review, stars) => {
  cy.get('[data-cy="podcast-name:F2 Legends"]').scrollIntoView().click({force: true});
  cy.get('button').contains('Add Your Review').click();
  if(review){
    cy.get('textarea[placeholder="Write your review here..."]').type(review);
  }
  if(stars){
    cy.get(`[data-cy="star-icon-${stars}"]`).click();
  }
  cy.contains('Submit Review').click()
})

Cypress.Commands.add('cleanup', () => {
  cy.login(null, "testRegister@email.com", "password123");
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible");
  cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
  cy.get("button")
    .contains("CreatorHub")
    .should("be.visible")
    .click({ timeout: 12000 });
  cy.wait(1000);
  cy.get('[data-cy="podcast-delete"]').should('exist').click({ timeout: 12000 });
  cy.wait(1000);
  cy.contains("Button", "Delete").should('exist').click({ timeout: 12000 });
  cy.url().should("include", "/CreatorHub");
  cy.get('body').should("not.contain", "Edit Podcast");
});

Cypress.Commands.add('mobile_cleanup', () => {
  cy.login(null, "mobileRegister@email.com", "password123");
  cy.wait(750);
  cy.visit('/CreatorHub')
  cy.get('[data-cy="podcast-delete"]').should('exist').click({ timeout: 12000 });
  cy.wait(1000);
  cy.contains("Button", "Delete").should('exist').click({ timeout: 12000 });
  cy.url().should("include", "/CreatorHub");
  cy.get('body').should("not.contain", "Edit Podcast");
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