

describe('Change Password', () => {

    it('Should not change password if the current password is wrong', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
          timeout: 12000,
        });
        cy.change_password("passwordWRONG", "password321", "password321");
        cy.contains('Invalid Credentials').should('exist');
    });

    it('Should not change password if the new password and confirm new password dont match', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
          timeout: 12000,
        });
        cy.change_password("password123", "password321", "password987");
        cy.contains('Your new Passwords do not match.').should('exist');
    });

    it('Should not change password if the new passwords dont meet password requirements', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
          timeout: 12000,
        });
        cy.change_password("password123", "abc", "abc");
        cy.contains('Your new Password must be at least 8 characters long and include both letters and numbers.').should('exist');
    });

    it('Should successfully change password', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
          timeout: 12000,
        });
        cy.change_password("password123", "password321", "password321");
        cy.url().should('include', '/profile/MyProfile');
        cy.wait(1500);
        cy.logout();
        cy.login(null, "testRegister@email.com", "password321");
    });

    it('Should successfully change password to the old for testing purposes', () => {
        cy.console_error_hack();
        cy.login(null, "testRegister@email.com", "password321");
        cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible", {
          timeout: 12000,
        });
        cy.change_password("password321", "password123", "password123");
        cy.wait(1000);
        cy.url().should('include', '/profile/MyProfile');
    });
});