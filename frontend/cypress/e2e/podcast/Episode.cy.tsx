
describe ('Episode_Create', () => { 

    const filepath_mp3_episode = 'mp3_files/Never_Gonna_Give_You_Up.mp3';
    const filepath_Episode_cover = 'images/charles_leclerc.jpg';
    const filepath_Episode_cover_science ='images/Has_science_gone_too_far.jpg';
    const bunny = 'images/bunny.jpg';
    const cat = 'images/cat.jpg';
    const shiba = 'images/shiba.jpg';

    beforeEach(() => {
        cy.visit('/'); 
        cy.url().should('include', '/');
        cy.login();
        cy.wait(500);
      });

    // User that exists should be able to create an Episode given that a Podcast exists
    it('Should Successfully create a new Episode', function () {
        cy.visit('/Create');
        cy.url().should('include', '/Create');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover);
        cy.get('input[placeholder="Enter episode name..."]').type("Charles Leclerc");
        cy.get('textarea[placeholder="Enter episode description..."]').type('From his rise in f2 to his demise at Ferrari');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.contains('Charles Leclerc');
        cy.contains('From his rise in f2 to his demise at Ferrari');
    });

    //Podcast should not be created if the Episode name already exists
    it('Should not create an Episode if the episode already exists', function () {
        cy.visit('/Create');
        cy.url().should('include', '/Create');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover);
        cy.get('input[placeholder="Enter episode name..."]').type("Charles Leclerc");
        cy.get('textarea[placeholder="Enter episode description..."]').type('From his rise in f2 to his demise at Ferrari');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/Create')
        cy.contains('An episode with the same name already exists for this podcast.').should('exist');
    });

    // User should be able to edit a episode name and have it reflected immediately
    it('Should successfully edit an episode', function () {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.wait(500);
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.url().should('include', '/MyPodcasts');
        cy.wait(1000);
        cy.get(':nth-child(1) > .css-1yp4ln > :nth-child(1) > .chakra-button > .chakra-icon').click();
        cy.wait(500);
        cy.get('input[placeholder="Enter episode name..."]').clear().type(' {selectall}{backspace}');
        cy.get('input[placeholder="Enter episode name..."]').type("Romain Grosjean");
        cy.contains('Button', 'Update').click();
        cy.url().should('include', '/MyPodcasts');
        cy.contains('Romain Grosjean');
    });
    
    // Episodes should not be created if the fields are empty
    it('Should not create an Episode if the fields are blank.', function () {
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

    it('Should add an episode from the Podcast interface', () => {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.wait(1000);
        cy.get('button').contains('New Episode').click();
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover_science);
        cy.get('input[placeholder="Enter episode name..."]').type("Has science gone too far?");
        cy.get('textarea[placeholder="Enter episode description..."]').type('Is AI the future?!');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.contains('Has science gone too far?');
        cy.contains('Is AI the future?!');
      });
    
    it('limits the number of characters in the input field', () => {
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Podcasts').click();
        cy.wait(1000);
        cy.get('button').contains('New Episode').click();
        cy.get('input[type="file"]').attachFile(filepath_Episode_cover_science);
        cy.get('input[placeholder="Enter episode name..."]').type("This is a very long episode title that should be cut off after 25 characters");
        cy.get('textarea[placeholder="Enter episode description..."]').type('Testing so fun!!');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('.css-1xmcsij > :nth-child(1) > .chakra-image').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.contains('This is a very long episo');
    });

    it('Should detele all episodes if a podcast is deleted', () => {
        cy.get('button[aria-label="Create"]').click();
        cy.url().should('include', '/Create');
        cy.get('.css-1bdrd0f').click();
        cy.url().should('include', '/NewPodcast');
        cy.wait(500);
        cy.get('input[type="file"]').attachFile(bunny);
        cy.wait(550);
        cy.get('input[id="podcastName"]').type('Cool pets');
        cy.get('textarea[id="description"]').type('A podcast about pets and their coolness.');
        cy.get(':nth-child(5) > .chakra-button').click();
        cy.get('button[id=createBtn]').click(); 
        cy.url().should('include', '/Create');
        cy.contains('Cool pets');
        cy.get('input[type="file"]').attachFile(shiba);
        cy.get('input[placeholder="Enter episode name..."]').type("Funny Shibas");
        cy.get('textarea[placeholder="Enter episode description..."]').type('Silly dogs');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('[data-cy="podcast-image-cool-pets"]').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.get('[data-cy="podcast-image-cool-pets"]').click();
        cy.contains('Funny Shibas');
        cy.contains('Silly dogs');
        cy.get('button').contains('New Episode').click();
        cy.get('input[type="file"]').attachFile(cat);
        cy.get('input[placeholder="Enter episode name..."]').type("Funny cats");
        cy.get('textarea[placeholder="Enter episode description..."]').type('Silly cats');
        cy.get('.css-70ttu').should('be.visible').within(() => {
            cy.get('input').attachFile(filepath_mp3_episode);
        });
        cy.get('[data-cy="podcast-image-cool-pets"]').click();
        cy.get('button[id=createBtn]').click();
        cy.wait(1000);
        cy.url().should('include', '/MyPodcasts')
        cy.get('[data-cy="podcast-image-cool-pets"]').click();
        cy.contains('Funny cats');
        cy.contains('Silly cats');
        cy.get('[data-cy="podcast-delete"]').click();
        cy.contains('Button', 'Delete').click();
        cy.url().should('include', '/MyPodcasts');
        cy.get('[data-cy="podcast-image-cool-pets"]').should('not.exist');
        cy.get('Funny cats').should('not.exist');
        cy.get('Funny Shibas').should('not.exist');
    });
});