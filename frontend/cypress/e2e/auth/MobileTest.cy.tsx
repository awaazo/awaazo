describe('Mobile Test', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
        });
        
        it('Should go to homescreen', () => {
            cy.visit('/');
        });
    }); 
});