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
    };

    /**
     * Returns the Profile Edit endpoint.
     * @returns The Profile Edit Endpoint
     */
    static getProfileEditEndpoint = () => {
        return this.getBackendAddress() + "/profile/edit";
    }

    /**
     * Returns the Profile Get endpoint.
     * @returns The Profile Get Endpoint
     */
    static getProfileGetEndpoint = () => {
        return this.getBackendAddress() + "/profile/get";
    }
  static profileGetRequest: any;

    /**
     * Returns the Comment endpoint.
     * @returns The Comment API Endpoint
     */
    static getCommentEndpoint = () => {
      return this.getBackendAddress() + "/social/comment";
  };

  /**
   * Returns the Get Episode Comment endpoint.
   * @returns The Get Episode Comment API Endpoint
   */
  static getEpisodeCommentEndpoint = () => {
      return this.getBackendAddress() + "/social/getEpisodeComment";
  };

  /**
   * Returns the Get User Comments endpoint.
   * @returns The Get User Comments API Endpoint
   */
  static getUserCommentsEndpoint = () => {
      return this.getBackendAddress() + "/social/getUserComments";
  };

  /**
   * Returns the Delete Comment endpoint.
   * @returns The Delete Comment API Endpoint
   */
  static getDeleteCommentEndpoint = () => {
      return this.getBackendAddress() + "/social/deleteComment";
  };

  /**
   * Returns the Like endpoint.
   * @returns The Like API Endpoint
   */
  static getLikeEndpoint = () => {
      return this.getBackendAddress() + "/social/like";
  };

  /**
   * Returns the Unlike endpoint.
   * @returns The Unlike API Endpoint
   */
  static getUnlikeEndpoint = () => {
      return this.getBackendAddress() + "/social/unlike";
  };
}