describe('EditProfile', () => {

    //User should be abble to edit profile and the changes should be reflected immediately
    it('Should successfully edit profile', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        const filepath = 'images/display_picture.png';
        cy.get('input[type="file"]').attachFile(filepath);
        cy.get('input#username').type('NewUsername');
        cy.get('textarea#bio').type('NewBio');
        cy.get(':nth-child(16) > .chakra-button').click();
        cy.get(':nth-child(7) > .chakra-button').click();
        cy.get(':nth-child(10) > .chakra-button').click();
        cy.get('input[placeholder="Twitter URL"]').type('https://twitter.com/newTwitterUsername');
        cy.get('input[placeholder="LinkedIn URL"]').type('https://linkedin.com/newLinkedInUsername');
        cy.get('input[placeholder="GitHub URL"]').type('https://github.com/newGitHub');
        cy.get('button').contains('Update Profile').click();
        cy.wait(500);
        cy.url().should('include', '/profile/MyProfile');
        cy.contains('NewUsername');
        cy.contains('NewBio');
    });

    //User info should not change if no updates are provided
    it('Should not edit anything if no inputs are given', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        cy.wait(500);
        cy.get('button').contains('Update Profile').click();
        cy.wait(500);
        cy.url().should('include', '/profile/MyProfile');
    });

    //Profile should not be edited if the fields are empty
    it('Should fail if input fields are empty', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        //cy.get('input#username').clear().type(' {selectall}{backspace}'); <-- Fix this with the tooltip 
        cy.get('textarea#bio').clear().type(' {selectall}{backspace}');
        cy.wait(500);
        cy.get('button').contains('Update Profile').click();
        cy.wait(500);
        cy.url().should('include', '/profile/EditProfile');
        cy.contains('The Bio field is required.').should('exist');
    });

    
    // Test for validating the format of the Twitter URL input
    it('Should validate the format of the Twitter URL input', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        cy.wait(500);
        cy.get('input[placeholder="Twitter URL"]').clear().type('invalidTwitterURL');
        cy.get('button').contains('Update Profile').click();
        cy.get('input[placeholder="Twitter URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });


    // Test for validating the format of the LinkedIn URL input
    it('Should validate the format of the LinkedIn URL input', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        cy.wait(500);
        cy.get('input[placeholder="LinkedIn URL"]').clear().type('invalidLinkedInURL');
        cy.get('button').contains('Update Profile').click();
        cy.get('input[placeholder="Twitter URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });

    // Test for validating the format of the GitHub URL input
    it('Should validate the format of the GitHub URL input', function(){
        cy.login();
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.get('button').contains('My Account').click();
        cy.get('button').contains('Edit Profile').click();
        cy.wait(500);
        cy.get('input[placeholder="GitHub URL"]').clear().type('invalidGitHubURL');
        cy.get('button').contains('Update Profile').click();
        cy.get('input[placeholder="Twitter URL"]').focus().trigger('mouseover');
        cy.url().should('include', '/profile/EditProfile');
    });
});