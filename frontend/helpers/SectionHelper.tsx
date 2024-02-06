import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import EndpointHelper from "./EndpointHelper";
import { SectionAddRequest } from "../types/Requests";
import {
  AddSectionResponse,
  BaseResponse,
  getSectionResponse,
} from "../types/Responses";

export default class PodcastHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a section request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static sectionCreateRequest = async (
    requestData: SectionAddRequest,
    episodeId,
  ): Promise<AddSectionResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      data: requestData,
      url: EndpointHelper.getSectionAddEndpoint(episodeId),
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastCreateRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastCreateResponse...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: error.response.data,
      };
    }
  };

  /**
   * Gets all sections from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static sectionGetRequest = async (
    episodeId,
  ): Promise<getSectionResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getSectionGetEndpoint(episodeId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastMyPodcastsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastMyPodcastsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        sections: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        sections: null,
      };
    }
  };

  /**
   * Deletes a section by sectionId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static sectionDeleteRequest = async (
    sectionId,
  ): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "Delete",
      url: EndpointHelper.getSectionDeleteEndpoint(sectionId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following deletePodcast...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following deletePodcast...");
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
}
