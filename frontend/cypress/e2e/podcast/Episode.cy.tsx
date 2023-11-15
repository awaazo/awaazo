
describe ('Episode_Create', () => { 

    const filepath_mp3_episode = 'mp3_files/Never_Gonna_Give_You_Up.mp3';
    const filepath_Episode_cover = 'images/charles_leclerc.jpg';

    // User that exists should be able to create an Episode given that a Podcast exists
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

    //Podcast should not be created if the Episode name already exists
    it('Should not create an Episode if the episode already exists', function () {
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
        cy.url().should('include', '/Create')
        cy.contains('Required.').should('exist');
    });

    // User should be able to edit a episode name and have it reflected immediately
    it('Should successfully edit an episode', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.wait(1000);
        cy.get('.css-1yp4ln > :nth-child(1) > .chakra-button').click();
        cy.wait(500);
        cy.get('input[placeholder="Enter episode name..."]').clear().type(' {selectall}{backspace}');
        cy.get('input[placeholder="Enter episode name..."]').type("Episode 2: Romain Grosjean");
        cy.contains('Button', 'Update').click();
        cy.url().should('include', '/MyPodcasts');
        cy.contains('Episode 2: Romain Grosjean');
    });
    
    // Episodes should not be created if the fields are empty
    it('Should not create an Episode if the fields are blank.', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.visit('/Create');
        cy.url().should('include', '/Create');
        cy.wait(500);
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/Create')
        cy.contains('Required.').should('exist');
    });

    // Episode should not be created if it's not linked to a Podcast
    it('Should not create an Episode if no podcast is selected.', function () {
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
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/Create')
        cy.contains('Please select the Podcast you wish to upload to');
    });

    // Users should be allowed to delete their own episodes
    it('Should successfully delete an episode', function () {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.wait(1000);
        cy.get(':nth-child(1) > .css-1yp4ln > :nth-child(2) > .chakra-button > .chakra-icon > [d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"]').click();
        cy.wait(500);
        cy.contains('Button', 'Delete').click();
        cy.url().should('include', '/MyPodcasts');
    });
    
    // Episode names should be able to include special symbols not bound to ASCII characters
    it('Should accept special symbols in episode name', () => {
        cy.visit('/');
        cy.url().should('include', '/');
        cy.login();
        cy.visit('/Create');
        cy.url().should('include', '/Create');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover);
        cy.get('input[placeholder="Enter episode name..."]').type("♣™∏⊄‾ℜ→∞ϖñ");
        cy.get('textarea[placeholder="Enter episode description..."]').type('Episode about cool symbols');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.contains('♣™∏⊄‾ℜ→∞ϖñ');
    });
});