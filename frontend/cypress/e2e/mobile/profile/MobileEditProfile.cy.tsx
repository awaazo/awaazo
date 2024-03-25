import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile EditProfile', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.visit('/');
            cy.login(null, 'mobileRegister@email.com', 'password123');
        });

        it('Should successfully edit profile', function(){
            cy.edit_profile(paths.profile_picture, 'NewUsernameMobile', 'NewBioMobile','https://twitter.com/newTwitterUsername','https://linkedin.com/newLinkedInUsername','https://github.com/newGitHub');
            cy.contains('NewUsernameMobile', { timeout: 15000 });
            cy.contains('NewBioMobile', { timeout: 5000 });
        });


        it('Should not edit anything if no inputs are given', function(){
            cy.edit_profile(null, null, null, null, null, null);
            cy.url().should('include', '/profile/MyProfile');
            cy.contains('NewUsernameMobile', { timeout: 5000 });
            cy.contains('NewBioMobile', { timeout: 5000 });
        });

        it('Should fail if input fields are empty', function(){
            cy.edit_profile(null, '{selectall}{backspace}', '{selectall}{backspace}', null, null, null);
            cy.url().should('include', '/profile/EditProfile');
        });
    })
});