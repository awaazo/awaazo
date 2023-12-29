describe("PlayerBar", () => { 

    it('Should remember what time I was at on the podcast', () =>  {
        let timePassedValue = ""
        let timeLeftValue = ""
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.wait(2500);
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.wait(10500);
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            timePassedValue = $timePassed.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy^="time-left-"]').then(($timeLeft) => {
            timeLeftValue = $timeLeft.text(); // or .val() depending on the element type
        });
        cy.data_log();
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.get('button[aria-label="loggedInMenu"]').click({ timeout: 5000 });
        cy.get("button").contains("My Account").click({ timeout: 5000 });
        cy.url().should("include", "/profile/MyProfile");
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            let timePassedValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(parseFloat(timePassedValue) - parseFloat(timePassedValue_temp)).to.be.lessThan(2);
        });
        cy.get('[data-cy^="time-left-"]').then(($timePassed) => {
            let timeLeftValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(parseFloat(timeLeftValue) - parseFloat(timeLeftValue_temp)).to.be.lessThan(2);
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
            expect(parseFloat(timePassedValue) - parseFloat(timePassedValue_temp)).to.be.lessThan(2);
        });
        cy.get('[data-cy^="time-left-"]').then(($timePassed) => {
            let timeLeftValue_temp = $timePassed.text(); // or .val() depending on the element type
            expect(parseFloat(timeLeftValue) - parseFloat(timeLeftValue_temp)).to.be.lessThan(2);
        });
    });

    it('Should successfully skip ahead when pushing the "Skip Ahead" button', () => {
        let timePassedValue = ""
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.wait(2500);
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
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

    it('Should successfully skip back when pushing the "Skip Back" button', () => {
        let timePassedValue = ""
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.wait(2500);
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.wait(15500);
        cy.get('[data-cy="play-pause-button"]').should('be.visible').click({timeout : 5000});
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            timePassedValue = $timePassed.text(); // or .val() depending on the element type
        });
        cy.get('[data-cy="skip-backward"]').should('be.visible').click({timeout : 5000});
        cy.get('[data-cy^="time-passed-"]').then(($timePassed) => {
            let timePassedValue_temp = $timePassed.text();
            expect(timePassedValue_temp).to.equal("00:05");
        });
    });

    it('Should like and unlike episode from the player bar', () => {
        let numLikesBefore = "1"
        let numLikesAfter = "0"
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
        timeout: 5000,
        });
        cy.wait(2500);
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('button[data-cy^="like-button-index:"]').last().click();
        cy.visit('/CreatorHub/MyPodcasts').url().should('include', '/CreatorHub/MyPodcasts');
        cy.get('[data-cy="podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa"]').should('be.visible').click({timeout: 5000})
        cy.get('[data-cy="podcast-image-f2-legends"]').should('be.visible').click({timeout: 5000})
        cy.get('[data-cy="episode-metric-Has science gone too far?-likes:1"]').should('be.visible').invoke('text').then((logText) => {
            const likeCount = logText.slice(-2).trim();
            expect(likeCount).to.equal(numLikesBefore); 
        });
        //Unliking
        cy.visit("/").url().should('include', '/');
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('button[data-cy^="like-button-index:"]').last().click();
        cy.visit('/CreatorHub/MyPodcasts').url().should('include', '/CreatorHub/MyPodcasts');
        cy.get('[data-cy="podcast-image-aaaaaaaaaaaaaaaaaaaaaaaaa"]').should('be.visible').click({timeout: 5000})
        cy.get('[data-cy="podcast-image-f2-legends"]').should('be.visible').click({timeout: 5000})
        cy.get('[data-cy="episode-metric-Has science gone too far?-likes:0"]').should('be.visible').invoke('text').then((logText) => {
            const likeCount = logText.slice(-2).trim();
            expect(likeCount).to.equal(numLikesAfter); 
        });
    })

    it('Should comment on an episode from the player bar', () =>{
        cy.login(null, "dummyRegister@email.com", "password123");
        cy.get('button[aria-label="loggedInMenu"]').should("be.visible", {
            timeout: 5000,
        });
        cy.wait(2500);
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').click({ timeout: 5000 });
        cy.get('textarea[placeholder="Add a comment..."]').should('be.visible').type("Love the episode! Half Life 3 when???");
        cy.contains('Add Comment').click();
        cy.contains('Love the episode! Half Life 3 when???');
        cy.get('.chakra-modal__close-btn').click();
        cy.logout();
        cy.login(null, "testRegister@email.com", "password123");
        cy.get('[data-cy="episode-card-Has science gone too far?"]').should('be.visible').last().click({ timeout: 5000 });
        cy.get('[data-cy="playerbar-comment-button"]').should('be.visible').click({ timeout: 5000 });
        cy.contains('DummyUsername:');
        cy.contains('Love the episode! Half Life 3 when???');
    });
});

//Ignore
// cy.get('button[data-cy^="like-button-index:"]').each(($button, index) => {
        //     const buttonId = $button.attr('data-cy').replace('like-button-index:', '');
        //     const concatenatedId = buttonId + index;
        //     if (concatenatedId === "3") {
        //         cy.wrap($button).click();
        //     }
        // });