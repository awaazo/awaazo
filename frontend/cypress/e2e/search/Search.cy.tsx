import * as paths from '../../fixtures/file_paths.json';

describe ('Search', () => {
    it('Should create a dummy user to interact with other users', function () {
        cy.visit('/').url().should('include', '/');
        cy.wait(250);
        cy.register_user('dummyRegister@email.com', 'DummyUsername', 'password123', 'password123', '2000-01-01');
        cy.setup_user(paths.dummy, 'DummyDisplayName', 'DummyDisplayBio');
        cy.url().should('include', '/');
        cy.visit('/profile/MyProfile');
        cy.contains('DummyDisplayBio');
    });
});