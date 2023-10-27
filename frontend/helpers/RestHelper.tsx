import axios from "axios";

export interface AuthLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    password: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Default API Response Object.
 */
export interface ResponseInfo {
  status: number;
  data: JSON;
}

export interface AuthMeInfo {
  status: number;
  is_error: boolean;
  error_message: string;
  user: UserInfo;
}

export interface UserInfo{
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export interface AuthLoginInfo {
  status: number;
  is_error: boolean;
  error_message: string;
  data: AuthLoginResponse;
}

export interface AuthRegisterInfo{
  status: number;
  is_error: boolean;
  error_message: string;
  data: AuthRegisterResponse;
}

export interface AuthRegisterResponse{
  token: string;
  user: {
    id: string;
    email: string;
    password: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Handles API calls to the backend.
 */
export default class RequestHelper {
  /**
   * Sends a GET Request to the requested URL with given parameters.
   * @param requestUrl Requested URL
   * @param requestParams Parameters as a JSON object
   * @returns ResponseInfo Object containing the response's status and data.
   */
  static getRequest = async (
    requestUrl: string,
    requestParams: JSON
  ): Promise<ResponseInfo> => {
    // Build the request's options.
    const options = {
      method: "GET",
      url: requestUrl,
      params: requestParams,
      headers: { accept: "*/*", "Content-Type": "application/json" },
    };

    console.debug("Sending the following GetRequest...");
    console.debug(options);

    // Send the request and wait for the response.
    const requestResponse = await axios.request(options);

    console.debug("Received the following response...");
    console.debug(requestResponse);

    // Return the response's status and data.
    return { status: requestResponse.status, data: requestResponse.data };
  };

  /**
   * Sends a POST Request to the requested URL with given parameters and body.
   * @param requestUrl Requested URL
   * @param requestParams Parameters as a JSON object
   * @param data Data of the body as a JSON object
   * @returns ResponseInfo Object containing the response's status and data.
   */
  static postRequest = async (
    requestUrl: string,
    requestParams: JSON,
    data: JSON
  ): Promise<ResponseInfo> => {
    // Build the request's options.
    const options = {
      method: "POST",
      url: requestUrl,
      params: requestParams,
      data: data,
      headers: { accept: "*/*", "Content-Type": "application/json" },
    };

    console.debug("Sending the following PostRequest...");
    console.debug(options);

    // Send the request and wait for the response.
    const requestResponse = await axios.request(options);

    console.debug("Received the following response...");
    console.debug(requestResponse);

    // Return the response's status and data.
    return { status: requestResponse.status, data: requestResponse.data };
  };

  /**
   * Sends a PUT Request to the requested URL with given parameters and body.
   * @param requestUrl Requested URL
   * @param requestParams Parameters as a JSON object
   * @param data Data of the body as a JSON object
   * @returns ResponseInfo Object containing the response's status and data.
   */
  static putRequest = async (
    requestUrl: string,
    requestParams: JSON,
    data: JSON
  ): Promise<ResponseInfo> => {
    // Build the request's options.
    const options = {
      method: "PUT",
      url: requestUrl,
      params: requestParams,
      data: data,
      headers: { accept: "*/*", "Content-Type": "application/json" },
    };

    console.debug("Sending the following PutRequest...");
    console.debug(options);

    // Send the request and wait for the response.
    const requestResponse = await axios.request(options);

    console.debug("Received the following response...");
    console.debug(requestResponse);

    // Return the response's status and data.
    return { status: requestResponse.status, data: requestResponse.data };
  };

  /**
   * Sends a DELETE Request to the requested URL with given parameters.
   * @param requestUrl Requested URL
   * @param requestParams Parameters as a JSON object
   * @returns ResponseInfo Object containing the response's status and data.
   */
  static deleteRequest = async (
    requestUrl: string,
    requestParams: JSON
  ): Promise<ResponseInfo> => {
    // Build the request's options.
    const options = {
      method: "DELETE",
      url: requestUrl,
      params: requestParams,
      headers: { accept: "*/*", "Content-Type": "application/json" },
    };

    console.debug("Sending the following DeleteRequest...");
    console.debug(options);

    // Send the request and wait for the response.
    const requestResponse = await axios.request(options);

    console.debug("Received the following response...");
    console.debug(requestResponse);

    // Return the response's status and data.
    return { status: requestResponse.status, data: requestResponse.data };
  };

/**
 * Sends a POST Request to the /auth/register endpoint with given parameters.
 * @param email User email
 * @param password User password
 * @param dateOfBirth User Date of Birth
 * @param gender User gender
 * @param username User Username
 * @returns AuthRegisterInfo with response data or error info
 */
  static authRegisterRequest = async (
    email: string,
    password: string,
    dateOfBirth: string,
    gender: string,
    username: string
  ): Promise<AuthRegisterInfo> => {
    // Build the request's options.
    const options = {
      method: "POST",
      url: EndpointHelper.getAuthRegisterEndpoint(),
      data: { email: email, password: password, dateOfBirth: dateOfBirth, username: username, gender: gender },
      headers: { accept: "*/*", "Content-Type": "application/json" },
      withCredentials: true
    };

    console.debug("Sending the following authRegisterRequest...");
    console.debug(options);

    try {
      // Send the request and wait for the response.
      const requestResponse = await axios.request(options);

      console.debug("Received the following response...");
      console.debug(requestResponse);

      // Return the response's status and data.
      return {
        status: requestResponse.status,
        is_error: false,
        error_message: "",
        data: requestResponse.data,
      };
} catch (error) {
  return {
    status: error.response ? error.response.status : null,
    is_error: true,
    error_message: error.response ? error.response.data : error.toString(),
    data: null,
  };
}

  };

  /**
   * Sends a POST Request to the /auth/login endpoint with given parameters.
   * @param email User email
   * @param password User password
   * @returns ResponseInfo Object containing the response's status and data.
   */
  static authLoginRequest = async (
    email: string,
    password: string
  ): Promise<AuthLoginInfo> => {
    // Build the request's options.
    const options = {
      method: "POST",
      url: EndpointHelper.getAuthLoginEndpoint(),
      data: { email: email, password: password },
      headers: { accept: "*/*", "Content-Type": "application/json" },
      withCredentials: true
    };

    console.debug("Sending the following authLoginRequest...");
    console.debug(options);

    try {
      // Send the request and wait for the response.
      const requestResponse = await axios.request(options);

      console.debug("Received the following response...");
      console.debug(requestResponse);

      // Return the response's status and data.
      return {
        status: requestResponse.status,
        is_error: false,
        error_message: "",
        data: requestResponse.data,
      };
} catch (error) {
  return {
    status: error.response ? error.response.status : null,
    is_error: true,
    error_message: error.response ? error.response.data : error.toString(),
    data: null,
  };
}

  };

  static authGoogleSSORequest = async (
    email:string,
    username:string,
    sub:string,
    avatar:string
  ): Promise<AuthLoginInfo> =>{

    // Build the request's options.
    const options = {
      method: "POST",
      url: EndpointHelper.getGoogleSSOEndpoint(),
      data: { email: email, username: username, sub: sub, avatar: avatar },
      headers: { accept: "*/*", "Content-Type": "application/json" },
    };

    console.debug("Sending the following authGoogleSSORequest...");
    console.debug(options);

    try {
      // Send the request and wait for the response.
      const requestResponse = await axios.request(options);

      console.debug("Received the following response...");
      console.debug(requestResponse);

      // Return the response's status and data.
      return {
        status: requestResponse.status,
        is_error: false,
        error_message: "",
        data: requestResponse.data,
      };
} catch (error) {
  return {
    status: error.response ? error.response.status : null,
    is_error: true,
    error_message: error.response ? error.response.data : error.toString(),
    data: null,
  };
}

  }

  /**
   * Sends a GET Request to the /auth/me endpoint with given JWT Token.
   * @param token JWT Token
   * @returns AuthMeInfo with response data or error info
   */
  static authMeRequest = async (token: string): Promise<AuthMeInfo> => {
    // Build the request's options.
    const options = {
      method: "GET",
      url: EndpointHelper.getAuthMeEndpoint(),
      headers: { 
        accept: "*/*", 
        "Content-Type": "application/json"},
      withCredentials: true
    };

    console.debug("Sending the following authMeRequest...");
    console.debug(options);

    try {
      // Send the request and wait for the response.
      const requestResponse = await axios.request(options);

      console.debug("Received the following response...");
      console.debug(requestResponse);

      // Return the response's status and data.
      return {
        status: requestResponse.status,
        is_error: false,
        error_message: "",
        user: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response ? error.response.status : null,

        is_error: true,
        error_message: error,
        user: null,
      };
    }
  };
}

/**
 * Provides the appropriate backend endpoints, depending on the environment
 */
export class EndpointHelper {
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
}
