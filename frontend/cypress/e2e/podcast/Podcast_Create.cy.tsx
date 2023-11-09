const filepath_Podcast_cover = 'images/max_verstappen_cover.jpg';


describe ('Postcast_Create', () => {

    it('Should successfully create a Podcast', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.wait(500);
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Podcast_cover);
        cy.wait(550);
        cy.get('input[id="podcastName"]').type('F1 Legends');
        cy.get('textarea[id="description"]').type('A podcast about F1 veterans and their rise to glory.');
        cy.get(':nth-child(5) > .chakra-button').click();
        cy.get(':nth-child(7) > .chakra-button').click();
        cy.get(':nth-child(10) > .chakra-button').click();
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/Create');
        cy.contains('F1 Legends');
    });
});