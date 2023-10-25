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
    }
}