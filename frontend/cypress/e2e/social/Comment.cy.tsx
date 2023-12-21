describe('Comment', () => {

    it('Should comment a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
        });
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('textarea[placeholder="Add a comment..."]').should('be.visible').type("Is there an error in the title?");
        cy.contains('Add Comment').click();
        cy.contains('Is there an error in the title?');
        cy.get('.chakra-modal__close-btn').click();
        cy.visit('/').url().should('include', '/');
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.wait(250);
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.contains("DummyUsername:");
        cy.contains("Is there an error in the title?");
    });

    it('Should reply to a comment on a Podcast', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
        });
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.get('Input[placeholder="Reply to this comment..."]').should('be.visible').first().type("No! I was testing stuff using Cypress!");
        cy.get('[data-cy="reply-button"]').should('be.visible').first().click();
        cy.get('.chakra-modal__close-btn').scrollIntoView().should('be.visible').click();
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.contains('No! I was testing stuff using Cypress!')
    });


    it('Should like a reply on a Podcast', () => {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
        });
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250)
        cy.get('button[data-cy^="like-button-index:"]').last().click();
    });

    it('Should delete a comment on a Podcast and consequently, delete all replies to said comment', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
        });
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click({ timeout: 5000 })
        cy.wait(250);
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').first().click({ timeout: 5000 })
        cy.get('[data-cy="delete-comment-id:"]').should('be.visible').first().click({ timeout: 5000 })
        cy.should('not.contain', 'No! I was testing stuff using Cypress!')
    })
});

//Ignore
// cy.get('button[data-cy^="like-button-index:"]').each(($button, index) => {
        //     const buttonId = $button.attr('data-cy').replace('like-button-index:', '');
        //     const concatenatedId = buttonId + index;
        //     if (concatenatedId === "4") {
        //         cy.wrap($button).click();
        //     }
        // });