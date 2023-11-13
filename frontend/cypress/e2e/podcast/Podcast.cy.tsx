
describe ('Postcast_Create', () => {
    
    // Declare the filepath for the podcast cover image
    const filepath_Podcast_cover = 'images/max_verstappen_cover.jpg';
    
    beforeEach(() => {
        cy.visit('/'); 
        cy.url().should('include', '/');
        cy.login();
        cy.wait(500);
      });


    // User that exists should be able to create a Podcast
    it('Should successfully create a Podcast', ()  => {
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

    //Podcast should not be created if the Podcast name already exists
    it('Should not create a podcast if the same podcast name already exists', () => {
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
        cy.contains('A podcast with the same name already exists').should('exist');
    });

    // User should be able to edit a podcast name and have it reflected immediately
    it('Should edit a Podcast', () => {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.wait(1000);
        cy.get('button').contains('Edit Podcast').click();
        cy.wait(500);
        cy.get('input[id="podcastName"]').clear().type(' {selectall}{backspace}');
        cy.get('input[id="podcastName"]').type("F2 legends");
        cy.contains('Button', 'Update').click();
        cy.url().should('include', '/MyPodcasts');
        cy.contains('F2 legends');
    });

    // User should be re-directed to Login if they try to create a Podcast without being logged in
    it('Shold redirect you to login if a user is not logged in', () =>{
        cy.logout();
        cy.visit('/');
        cy.url().should('include', '/');
        cy.get('button[aria-label="Create"]').click();
        cy.wait(1000);
        cy.url().should('include', '/auth/Login');
    });

    // Podcast should not be created if the fields are empty
    it('Should not create a podcast if fields are empty', () => {
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/NewPodcast');
        cy.contains('Required.').should('exist');
    });

    // Podcast cover photos should not accept anything else other than image files
    it('Should not accept files other than image files', () => {
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
        cy.contains('Cover art must be a JPEG, PNG, or SVG.').should('exist');
    });

    // Podcast names should be able to include special symbols not bound to ASCII characters
    it('Should accept special symbols in podcast name', () => {
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

    // Users should be allowed to delete their own podcasts
    it('Should delete a Podcast', () => {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.wait(1000);
        cy.get('.css-1r37h6l').click();
        cy.contains('Button', 'Delete').click();
        cy.url().should('include', '/MyPodcasts');
    });

    it.only('limits the number of characters in the input field', () => {
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Podcast_cover);
        cy.wait(550);
        cy.get('input[id="podcastName"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        cy.get('textarea[id="description"]').type('A podcast about error handling.');
        cy.get(':nth-child(5) > .chakra-button').click();
        cy.get(':nth-child(7) > .chakra-button').click();
        cy.get(':nth-child(10) > .chakra-button').click();
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/Create');
        cy.visit('/MyPodcasts'); 
        cy.contains('aaaaaaaaaaaaaaaaaaaaaaaaa');
      });
    
});