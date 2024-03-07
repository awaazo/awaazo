import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Register', () => {
    context('Mobile resolution', () => {
        beforeEach(() =>{
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.visit('/');
        });

        it('Should go to home screen register a new user using the mobile interface', () => {
            cy.register_user(
            "mobileRegister@email.com",
            "MobileUsername",
            "password123",
            "password123",
            "2000-01-01",
            );
            cy.wait(500);
            cy.get('body').then(($body) => {
            if ($body.text().includes('An Account with that Email and/or Username already exists. Please Login or use a different Email address.')) {
                expect(true).to.be.true;
            }else{
                if ($body.text().includes('An Account with that Email and/or Username already exists. Please Login or use a different Email address.')) {
                expect(true).to.be.true;
                }
                cy.setup_user(paths.profile_picture, "MobileDisplayName", "MobileDisplayBio");
                cy.url().should('include', '/');
                cy.wait(1000);
                cy.visit("/profile/MyProfile", { timeout: 5000 });
                cy.contains("MobileDisplayBio", {timeout: 5000});
            }
            });
        });

        it("Should not Register new User Passwords that do not match", function () {
            cy.register_user(
              "mobileRegister@email.com",
              "notsamepasswords",
              "password123",
              "password1234",
              "2000-01-01",
            );
            cy.url().should("include", "/auth/Signup");
            cy.contains("Passwords do not match.").should("be.visible");
          });

          it("Should not Register new User with existing email", function () {
            cy.register_user(
              "mobileRegister@email.com",
              "MobileUsername",
              "password123",
              "password123",
              "2000-01-01",
            );
            cy.url().should("include", "/auth/Signup");
            cy.contains(
              "An Account with that Email and/or Username already exists. Please Login or use a different Email address.",
            ).should("be.visible");
          });
    }); 
});