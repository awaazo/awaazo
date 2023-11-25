import * as paths from '../../fixtures/file_paths.json';

describe ('Search', () => {
    it('Should create a dummy user to interact with other users', () => {
        cy.visit('/').url().should('include', '/');
        cy.wait(250);
        cy.register_user('dummyRegister@email.com', 'DummyUsername', 'password123', 'password123', '2000-01-01');
        cy.setup_user(paths.dummy, 'DummyDisplayName', 'DummyDisplayBio');
        cy.url().should('include', '/');
        cy.visit('/profile/MyProfile');
        cy.contains('DummyDisplayBio');
    });

    //Ideal use case, search for a user & visit their profile
    it('Should search for a User and visit their profile', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('testUsername{enter}');
        cy.get('[data-cy="user-card-TestDisplayName"]').should('be.visible').click({ timeout: 5000 });
        cy.contains("TestDisplayBio").should('be.visible');
    });

    //Ideal use case, search for a user & view their uploaded podcasts
    it('Should search for a User and view a podcast from their profile', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('testUsername{enter}');
        cy.get('[data-cy="user-card-TestDisplayName"]').should('be.visible').click({ timeout: 5000 });
        cy.contains("TestDisplayBio").should('be.visible');
        cy.get('[data-cy="podcast-card-F2 legends"').should('be.visible').click({ timeout: 5000 });
        cy.contains("Has science gone too far?").should('be.visible');
    });

    //Ideal use case, search for a podcast and view their episodes
    it('Should search for a Podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('f2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click({ timeout: 5000 });
        cy.contains("Has science gone too far?").should('be.visible');
    });

    //Should not return anything if search bar is empty
    it('Should return nothing if no input is given', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('{enter}');
        cy.contains("No podcasts have been found").should('be.visible');
        cy.contains("No users have been found").should('be.visible');
    });

    //Should not return anything is the written input doesn't match anything
    it('Should return nothing if search does not match any user and/or podcast', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('This doesnt exist{enter}');
        cy.contains("No podcasts have been found").should('be.visible');
        cy.contains("No users have been found").should('be.visible');
    });
});