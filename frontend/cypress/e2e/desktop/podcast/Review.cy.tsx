import * as paths from '../../../fixtures/file_paths.json';

describe('Review', () => {
    
    beforeEach(() => {
        cy.console_error_hack();
    });

    it('Should create a Podcast so others can review it', function () {
        cy.login(null, 'testRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.podcast_create(paths.max_verstappen_cover,'F2 Legends', 'A podcast about F1 veterans and their rise to glory.')
        cy.url().should('include', '/CreatorHub');
    });

    it('Should successfully add a review', function(){
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.review_create('Great podcast, love the detail!',5);
        cy.contains('Great podcast, love the detail!');
        cy.contains('ratings');
    });

    it('Should add a review with a rating but no review', () => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.review_create(null,3);
        cy.contains('ratings');
    });

    it('Should not add a review if no rating is given', function(){
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.review_create('Could have been better', null);
        cy.contains('You must submit a rating');
    });

    it('Should successfully cancel writing a review', function(){
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should('be.visible', { timeout: 5000 });
        cy.get('[data-cy="podcast-name:F2 Legends"]').scrollIntoView().click({force: true});
        cy.get('button').contains('Add Your Review').click();
        cy.contains('Cancel').click();
        cy.get('[data-cy="star-icon-2"]').should('not.exist');
    });

    it('Should cleanup', function (){
        cy.cleanup();
    });
});   