describe("PlayerBar", () => { 

    it('Should remember what time I was at on the podcast', () =>  {
        let timePassedValue = ""
        let timeLeftValue = ""
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').click({ timeout: 5000 });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.wait(10500);
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            timePassedValue = $timePassed.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy^="time-left-"]').then(($timeLeft) => {
            timeLeftValue = $timeLeft.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.get('button[aria-label="loggedInMenu"]').click({ timeout: 5000 });
        cy.get("button").contains("My Podcasts").click({ timeout: 5000 });
        cy.url().should("include", "/MyPodcasts");
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            let timePassedValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(timePassedValue).to.equal(timePassedValue_temp);
        });
        cy.get('[data-cy^="time-left-"]').then(($timePassed) => {
            let timeLeftValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(timeLeftValue).to.equal(timeLeftValue_temp);
        });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.wait(5500);
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            timePassedValue = $timePassed.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy^="time-left-"]').then(($timeLeft) => {
            timeLeftValue = $timeLeft.text(); // or .val() depending on the element type
        });
        cy.get('button[aria-label="loggedInMenu"]').should('be.visible');
        cy.get('button[aria-label="loggedInMenu"]').click();
        cy.contains('button', 'My Account', {timeout: 5000}).then(($btn) => {
            if ($btn) {
            $btn.click();
            }
        }).then(($btn) => {
            if (!$btn) {
            cy.get('button[aria-label="loggedInMenu"]').click();
            }
        });
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            let timePassedValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(timePassedValue).to.equal(timePassedValue_temp);
        });
        cy.get('[data-cy^="time-left-"]').then(($timePassed) => {
            let timeLeftValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(timeLeftValue).to.equal(timeLeftValue_temp);
        });
    });

    it('Should successfully skip ahead when pushing the "Skip Ahead" button', () => {
        let timePassedValue = ""
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').click({ timeout: 5000 });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.wait(5500);
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            timePassedValue = $timePassed.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy="skip-forward"]').should('be.visible').click({timeout : 5000});
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            let timePassedValue_temp = $timePassed.text();
            expect(timePassedValue_temp).to.equal("00:15");
        });
    });

});