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

    it('Shold redirect you to login if a user is not logged in', () =>{
        cy.visit('/');
        cy.url().should('include', '/');
        cy.get('button[aria-label="Create"]').click();
        cy.wait(1000);
        cy.url().should('include', '/auth/Login');
    });

    it('Should not create a podcast if the same podcast name already exists', () => {
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
        cy.url().should('include', '/NewPodcast');
        cy.contains('Required.').should('exist');
    });

    it('Should not create a podcast if fields are empty', () => {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.wait(500);
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/NewPodcast');
        cy.contains('Required.').should('exist');
    });

    it('Should not accept files other than image files', () => {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.wait(500);
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile('mp3_files/Never_Gonna_Give_You_Up.mp3');
        cy.wait(550);
        cy.get('input[id="podcastName"]').type('Rick Astley');
        cy.get('textarea[id="description"]').type('Never gonna give you up!.');
        cy.get(':nth-child(5) > .chakra-button').click();
        cy.get(':nth-child(7) > .chakra-button').click();
        cy.get(':nth-child(10) > .chakra-button').click();
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/NewPodcast');
        cy.contains('Required.').should('exist');
    });

    it('Should accept special symbols in podcast name', () => {
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
        cy.get('input[id="podcastName"]').type('♣™∏⊄‾ℜ→∞ϖñ');
        cy.get('textarea[id="description"]').type('A podcast about CRAZY symbols.');
        cy.get(':nth-child(5) > .chakra-button').click();
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/Create');
        cy.contains('♣™∏⊄‾ℜ→∞ϖñ');
    });
});