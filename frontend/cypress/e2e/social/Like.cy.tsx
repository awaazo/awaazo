describe ('Like', () => { 

    beforeEach(() => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
          timeout: 5000,
        });
    });
    
    it('Should like a Podcast', () => {
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(250);
        cy.get('[data-cy="likes-on-This is a very long episo-0"]').should('be.visible').click( {timeout:5000} )
        cy.visit('/').url().should('include', '/');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.get('[data-cy="likes-on-This is a very long episo-1"]').should('be.visible');
    });

    it('Should unlike a Podcast', () => {
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(250);
        cy.get('[data-cy="likes-on-This is a very long episo-1"]').should('be.visible').click( {timeout:5000} )
        cy.visit('/').url().should('include', '/');
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.get('[data-cy="likes-on-This is a very long episo-0"]').should('be.visible');
    });
});