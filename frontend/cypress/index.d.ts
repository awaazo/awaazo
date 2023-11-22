//put all commands here

declare namespace Cypress {
    interface Chainable<Subject = any> {
      login(username: string, email: string, password: string): void;
      logout(): Chainable<any>;
      console_error_hack(): Chainable<any>;
      upload_image_from_fixtures(): Chainable<any>;
      register_user(email: string, username: string, password: string, confirmPassword: string, birthdate: string): void;
      setup_user(filepath: string, displayName: string, bio: string): void;
      edit_profile(filepath: string, username: string, bio: string, twitterURL: string, linkedInURL: string, githubURL: string): void;
      podcast_create(filepath: string, name: string, description:string): void;
      episode_create(filepath: string, name: string, description:string, sound_file:string, podcast: string): void;
      review_create(description: string, stars: number): void;
      data_log(): Chainable<any>;
    }
  }
