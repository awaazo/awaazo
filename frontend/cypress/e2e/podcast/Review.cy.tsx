

describe('Review', () => {
    
    it('Should successfully add a review', function(){
        cy.login();
        cy.get('.css-1veud7x > :nth-child(1) > .chakra-image').click();
        cy.get('button').contains('Add Your Review').click();
        cy.get('textarea[placeholder="Write your review here..."]').type('Great podcast, love the detail!');
        cy.get('[data-cy="star-icon-2"]').click();
        cy.contains('Submit Review').click()
        cy.contains('Great podcast, love the detail!');
        cy.contains('ratings');
    });

    it('Should add a review with a rating but no review', () => {
        cy.login();
        cy.visit('/');
        cy.wait(500);
        cy.get('.css-1veud7x > :nth-child(1) > .chakra-image').click();
        cy.get('button').contains('Add Your Review').click();
        cy.get('[data-cy="star-icon-2"]').click();
        cy.contains('Submit Review').click()
        cy.contains('ratings');
    });

    it('Should not add a review if no rating is given', function(){
        cy.login();
        cy.visit('/');
        cy.wait(500);
        cy.get('.css-1veud7x > :nth-child(1) > .chakra-image').click();
        cy.get('button').contains('Add Your Review').click();
        cy.get('textarea[placeholder="Write your review here..."]').type('Great podcast, love the detail!');
        cy.contains('Submit Review').click();
        cy.contains('You must submit a rating');
    });

    it('Should successfully cancel writing a review', function(){
        cy.login();
        cy.visit('/');
        cy.wait(500);
        cy.get('.css-1veud7x > :nth-child(1) > .chakra-image').click();
        cy.get('button').contains('Add Your Review').click();
        cy.contains('Cancel').click();
        cy.get('[data-cy="star-icon-2"]').should('not.exist');
    });
});   