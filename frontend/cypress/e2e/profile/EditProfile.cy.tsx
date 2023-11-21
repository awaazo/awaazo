import * as paths from '../../fixtures/file_paths.json';


describe('EditProfile', () => {
    
    beforeEach(() => {
        cy.login(null, 'testRegister@email.com', 'password123');
      });
    
    //User should be abble to edit profile and the changes should be reflected immediately
    it('Should successfully edit profile', function(){
        cy.edit_profile(paths.profile_picture, 'NewUsername', 'NewBio','https://twitter.com/newTwitterUsername','https://linkedin.com/newLinkedInUsername','https://github.com/newGitHub');
        cy.contains('NewUsername');
        cy.contains('NewBio');
    });


    //User info should not change if no updates are provided
    it('Should not edit anything if no inputs are given', function(){
        cy.edit_profile(null, null, null, null, null, null);
        cy.url().should('include', '/profile/MyProfile');
        cy.contains('NewUsername');
        cy.contains('NewBio');
    });

    //Profile should not be edited if the fields are empty
    it('Should fail if input fields are empty', function(){
        cy.edit_profile(null, '{selectall}{backspace}', '{selectall}{backspace}', null, null, null);
        cy.url().should('include', '/profile/EditProfile');
    });

    
    // // Test for validating the format of the Twitter URL input
    it('Should validate the format of the Twitter URL input', function(){
        cy.edit_profile(null, null, null, 'invalidTwitterURL', null, null);
        cy.get('input[placeholder="Twitter URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });


    // Test for validating the format of the LinkedIn URL input
    it('Should validate the format of the LinkedIn URL input', function(){
        cy.edit_profile(null, null, null, null, 'invalidLinkedInURL', null);
        cy.get('input[placeholder="LinkedIn URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });

    // Test for validating the format of the GitHub URL input
    it('Should validate the format of the GitHub URL input', function(){
        cy.edit_profile(null, null, null, null, null, 'invalidGitHubURL');
        cy.get('input[placeholder="GitHub URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });
});