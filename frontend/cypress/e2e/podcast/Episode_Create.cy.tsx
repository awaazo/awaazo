const filepath_mp3_episode = 'mp3_files/Never_Gonna_Give_You_Up.mp3';
const filepath_Episode_cover = 'images/charles_leclerc.jpg';

describe ('Episode_Create', () => { 
    
    it('Should Successfully create a new Episode', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.visit('/Create');
        cy.url().should('include', '/Create');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover);
        cy.get('input[placeholder="Enter episode name..."]').type("Episode 2: Charles Leclerc");
        cy.get('textarea[placeholder="Enter episode description..."]').type('From his rise in f2 to his demise at Ferrari');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.contains('Episode 2: Charles Leclerc');
        cy.contains('From his rise in f2 to his demise at Ferrari');
    });
});