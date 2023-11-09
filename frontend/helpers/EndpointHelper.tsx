/**
 * Provides the appropriate backend endpoints, depending on the environment
 */
export default class EndpointHelper {
    /**
     * Returns the address of the backend, which will vary
     * depending on the environment.
     * @returns The address of the backend
     */
    static getBackendAddress = () => {
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      )
        return "http://localhost:32773";
      else return "http://localhost:32773";
    };
  
    /**
     * Returns the backend login endpoint.
     * @returns The Login API Endpoint
     */
    static getAuthLoginEndpoint = () => {
      return this.getBackendAddress() + "/auth/login";
    };

    /**
     * Returns the backend logout endpoint.
     * @returns The Logout API Endpoint
     */
    static getAuthLogoutEndpoint = () => {
        return this.getBackendAddress() + "/auth/logout";
    }
  
    /**
     * Returns the backend register endpoint.
     * @returns The Register API Endpoint
     */
    static getAuthRegisterEndpoint = () => {
      return this.getBackendAddress() + "/auth/register";
    };
  
    /**
     * Returns the backend Me endpoint.
     * @returns The Me API Endpoint
     */
    static getAuthMeEndpoint = () => {
      return this.getBackendAddress() + "/auth/me";
    };
  
    /**
     * Returns the Google SSO endpoint.
     * @returns The Google SSO Endpoint
     */
    static getGoogleSSOEndpoint = () => {
      return this.getBackendAddress() + "/auth/googleSSO";
    };

    /**
     * Returns the Profile Setup endpoint.
     * @returns The Profile Setup Endpoint
     */
    static getProfileSetupEndpoint = () => {
        return this.getBackendAddress() + "/profile/setup";
    }

    /**
     * Returns the Profile Edit endpoint.
     * @returns The Profile Edit Endpoint
     */
    static getProfileEditEndpoint = () => {
        return this.getBackendAddress() + "/profile/edit";
    };

    /**
     * Returns the Podcast Rating and Reviews endpoint.
     * @returns The Podcast Rating Endpoint
     */

    static getPodcastRatingEndpoint = () => {
        return this.getBackendAddress() + "/social/rating";
    }

    static getPodcastRatingDeleteEndpoint = () => {
        return this.getBackendAddress() + "/social/deleteRating";
    }

    static getPodcastReviewEndpoint = () => {
        return this.getBackendAddress() + "/social/review";
    }

    static getPodcastReviewDeleteEndpoint = () => {
        return this.getBackendAddress() + "/social/deleteReview";
    }

    static getPodcastEndpoint = () => {
      return this.getBackendAddress() + "/podcast/myPodcasts";
    }


    /**
     * Returns the Profile Get endpoint.
     * @returns The Profile Get Endpoint
     */
    static getProfileGetEndpoint = () => {
        return this.getBackendAddress() + "/profile/get";
    }
  static profileGetRequest: any;
}