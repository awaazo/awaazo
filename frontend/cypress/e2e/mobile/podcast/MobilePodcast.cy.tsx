import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Podcast', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.login(null, 'mobileRegister@email.com', 'password123');
        });

        it('Should successfully create a Podcast', ()  => {
            cy.podcast_create(paths.max_verstappen_cover,'F1 Legends', 'A podcast about F1 veterans and their rise to glory.')
            cy.contains('F1 Legends');
        });

        it('Should not create a podcast if the same podcast name already exists', () => {
            cy.podcast_create(paths.max_verstappen_cover,'F1 Legends', 'A podcast about F1 veterans and their rise to glory.')
            cy.contains('A podcast with the same name already exists').should('exist');
        });

        it('Should not create a podcast if fields are empty', () => {
            cy.podcast_create(paths.max_verstappen_cover, null, null);
            cy.url().should('include', '/CreatorHub/CreatePodcast');
            cy.contains('Required.').should('exist');
        });

        it('Should clean up the suite by deleting the podcasts', () => {
            { skipBeforeEach: true }
            cy.mobile_cleanup();
        });
        
    });
});