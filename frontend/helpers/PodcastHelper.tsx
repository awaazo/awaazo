import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { EpisodeAddRequest, PodcastCreateRequest } from "../utilities/Requests";
import { BaseResponse, MyPodcastResponse } from "../utilities/Responses";

export default class PodcastHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a new podcast request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastCreateRequest = async (
    requestData: PodcastCreateRequest,
  ): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getPodcastCreateEndpoint(),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
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
   * Gets all myPodcasts from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastMyPodcastsGet = async (): Promise<MyPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastMyPodcastsEndpoint(),
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
        myPodcasts: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        myPodcasts: null,
      };
    }
  };

  /**
   * Creates a new episode add request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static episodeAddRequest = async (
    requestData: EpisodeAddRequest,
    podcastId,
  ): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getEpisodeAddEndpoint(podcastId),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
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
