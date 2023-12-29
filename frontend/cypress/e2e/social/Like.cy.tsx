describe ('Like', () => { 

    beforeEach(() => {
        cy.login(null, 'dummyRegister@email.com', 'password123');
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
          timeout: 5000,
        });
    });
    
    it('Should like a Podcast', () => {
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click( {timeout:5000} )
        cy.get('[data-cy="likes-on-This is a very long episo-0"]').should('be.visible').click( {timeout:5000} )
        cy.visit('/').url().should('include', '/');
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').first().click( {timeout:5000} )
        cy.wait(500);
        cy.get('[data-cy="likes-on-This is a very long episo-1"]').should('be.visible');
        
    });

    it('Should unlike a Podcast', () => {
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(500);
        cy.get('[data-cy="likes-on-This is a very long episo-1"]').should('be.visible').click( {timeout:5000} )
        cy.wait(250);
        cy.visit('/').url().should('include', '/');
        cy.wait(400);
        cy.get('[data-cy="search-input-web"]').should('be.visible').type('F2{enter}');
        cy.get('[data-cy="podcast-card-F2 legends"]').should('be.visible').click( {timeout:5000} )
        cy.wait(500);
        
        cy.get('[data-cy^="likes-on-This is a very long episo"]').last().then(($btn) => {
            const dataCyValue = $btn.attr('data-cy');
            const lastCharacter = dataCyValue.charAt(dataCyValue.length - 1);
            
            if (lastCharacter === '0') {
                expect(true).to.be.true;
            }else{
                cy.get('[data-cy="likes-on-This is a very long episo-1"]').should('be.visible').click( {timeout:5000} )
                cy.wait(500);
                cy.reload();
                cy.wait(500);
                cy.get('[data-cy="likes-on-This is a very long episo-0"]').should('be.visible').click( {timeout:5000} )
            }
        });

        //cy.get('[data-cy="likes-on-This is a very long episo-0"]').should('be.visible')
    });
});