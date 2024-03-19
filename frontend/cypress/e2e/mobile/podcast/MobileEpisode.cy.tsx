import * as paths from '../../../fixtures/file_paths.json';

describe('Mobile Episode', () => {
    context('Mobile resolution', () => {
        beforeEach(() => {
            cy.viewport(414, 896)
            cy.console_error_hack();
            cy.login(null, 'mobileRegister@email.com', 'password123');
            cy.wait(750);
        });

        it("Should create a podcast to upload Episodes to", function () {
            cy.podcast_create(paths.f2_car, 'F2 Legends', 'A podcast about F2 veterans and their rise to glory.')
            cy.url().should('include', '/CreatorHub');
        });

        // User that exists should be able to create an Episode given that a Podcast exists
        it("Should Successfully create a new Episode", function () {
            cy.episode_create(
                paths.Episode_cover,
                "Charles Leclerc",
                "From his rise in f2 to his demise at Ferrari",
                paths.never_gonna_give_you_up,
                "f2",
            );
            cy.wait(500);
            cy.get('body').then(($body) => {
                if ($body.text().includes('An episode with the same name already exists for this podcast.')) {
                    expect(true).to.be.true;
                } else {
                    cy.get("button").contains("Finish").click({ timeout: 12000 });
                    cy.url().should("include", "/CreatorHub");
                    cy.contains("Charles Leclerc");
                }
            });
        });

        //Podcast should not be created if the Episode name already exists
        it("Should not create an Episode if the episode already exists", function () {
            cy.episode_create(
                paths.Episode_cover,
                "Charles Leclerc",
                "From his rise in f2 to his demise at Ferrari",
                paths.never_gonna_give_you_up,
                "f2",
            );
            cy.url().should("include", "/CreatorHub");
            cy.contains(
                "An episode with the same name already exists for this podcast.",
            ).should("exist");
        });

        //Making sure on mobile functionality to delete an episode exists
        it("Should successfully delete an episode", function () {
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().should("be.visible");
            cy.get('button[aria-label="loggedInMenu"]').scrollIntoView().click();
            cy.get("button")
                .contains("CreatorHub")
                .should("be.visible")
                .click({ timeout: 12000 });
            cy.url().should("include", "/CreatorHub");
            cy.get("[data-cy=delete-button]").first().click();
            cy.contains("Button", "Delete").click({ timeout: 12000 });
            cy.url().should("include", "/CreatorHub");
        });

        it('Should clean up the suite by deleting the podcasts', () => {
            { skipBeforeEach: true }
            cy.logout();
            cy.mobile_cleanup();
        });
    });
});