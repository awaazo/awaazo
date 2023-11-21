//put all commands here

declare namespace Cypress {
    interface Chainable<Subject = any> {
      login(): Chainable<any>;
      logout(): Chainable<any>;
      console_error_hack(): Chainable<any>;
      upload_image_from_fixtures(): Chainable<any>;
      register_user(email: string, username: string, password: string, confirmPassword: string, birthdate: string): void;
      setup_user(filepath: string, displayName: string, bio: string): void;
      data_log(): Chainable<any>;
    }
  }
