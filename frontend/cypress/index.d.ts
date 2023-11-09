//put all commands here

declare namespace Cypress {
    interface Chainable<Subject = any> {
      login(): Chainable<any>;
      logout(): Chainable<any>;
      console_error_hack(): Chainable<any>;
      upload_image_from_fixtures(): Chainable<any>;
      Quick_register(): Chainable<any>;
    }
  }
