import axios from "axios";
import {
  UserProfileEditRequest,
  UserProfileSetupRequest,
  ChangePasswordRequest,
} from "../types/Requests";
import EndpointHelper from "./EndpointHelper";
import {
  BaseResponse,
  UserProfileResponse,
  SearchProfilesResponse,
  UserProfileByIdResponse,
  GetChangePasswordResponse
} from "../types/Responses";
import { data } from "cypress/types/jquery";

export default class UserProfileHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Saves the user's profile setup request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static profileSetupRequest = async (
    requestData: UserProfileSetupRequest,
  ): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getProfileSetupEndpoint(),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following profileSetupRequest...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following profileSetupResponse...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      };
    }
  };

  /**
   * Saves the user's profile edit request to the server.
   * @param requestData  Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static profileEditRequest = async (
    requestData: UserProfileEditRequest,
  ): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getProfileEditEndpoint(),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following profileEditRequest...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following profileEditResponse...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      };
    } catch (error) {
      console.error(error);

      // Get the error message.
      let errorMsg = error.response.statusText;
      if (error.response.status === 400) {
        let msg = "";
        const errors = error.response.data.errors;
        for (const key in errors) {
          msg += errors[key] + "\n";
        }

        if (msg != "") errorMsg = msg;
        else errorMsg = error.response.data;
      }

      // Return the error.
      return {
        status: error.response.status,
        message: errorMsg,
      };
    }
  };

  /**
   * Gets the user's profile from the server.
   * @returns A UserProfileResponse object with the server's response.
   */
  public static profileGetRequest = async (): Promise<UserProfileResponse> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getProfileGetEndpoint(),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
    };

    try {
      console.debug("Sending the following profileGetRequest...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following profileGetResponse...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        userProfile: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        userProfile: null,
      };
    }
  };

  /**
   * Gets the user's profile from the server.
   * @returns A UserProfileResponse object with the server's response.
   */
  public static profileGetByIdRequest = async (
    userId,
  ): Promise<UserProfileByIdResponse> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getProfileByIdEndpoint(userId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
    };

    try {
      console.debug("Sending the following profileGetRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following profileGetResponse...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        userProfileByID: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        userProfileByID: null,
      };
    }
  };

  /**
   * Gets all users by search from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static profileSearchProfilesGet = async (
    page,
    pageSize,
    searchTerm,
  ): Promise<SearchProfilesResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getProfileSearchEndpoint(searchTerm, page, pageSize),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following profileSearchPodcastsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following profileSearchPodcastsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        users: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        users: null,
      };
    }
  };

  /**
   * Changes current users password
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static changePasswordRequest = async (
    requestData: ChangePasswordRequest,
  ): Promise<GetChangePasswordResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      url: EndpointHelper.getChangePasswordEndpoint(),
      data: requestData,
      headers: {
        accept: "*/*",
        "Content-Type": "application/json"
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following changePasswordRequest...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following changePasswordResponse...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: error.response.data
      };
    }
  };
}
