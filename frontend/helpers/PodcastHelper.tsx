import axios, { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from "axios";
import EndpointHelper from "./EndpointHelper";
import { EpisodeAddRequest, PodcastCreateRequest, PodcastEditRequest, PodcastByTagsRequest, EpisodeEditRequest, SaveWatchHistoryRequest, PodcastSearchRequest, EpisodeSearchRequest } from "../types/Requests";
import {
  BaseResponse,
  CreatePodcastResponse,
  MyPodcastResponse,
  GetMyPodcastResponse,
  CreateEpisodeResponse,
  ByTagsPodcastResponse,
  SearchPodcastResponse,
  AllPodcastResponse,
  EditEpisodeResponse,
  GetMyEpisodeResponse,
  EditPodcastResponse,
  GetTranscriptResponse,
  GetWatchHistoryResponse,
  GetMetricsResponse,
  SearchEpisodeResponse,
  AllEpisodeResponse,
} from "../types/Responses";

export default class PodcastHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a new podcast request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastCreateRequest = async (requestData: PodcastCreateRequest): Promise<CreatePodcastResponse> => {
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
   * Gets all myPodcasts from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastMyPodcastsGet = async (page, pageSize): Promise<MyPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastMyPodcastsEndpoint(page, pageSize),
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
   * Gets all getRecentPodcasts from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastGetRecentPodcasts = async (
    page,
    pageSize,
  ): Promise<AllPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getRecentPodcastsEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
      },
    };

    try {
      console.debug("Sending the following podcastGetRecentPodcasts...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.log(
        "Received the following podcastGetRecentPodcasts... \n" +
          requestResponse,
      );

      console.debug("Received the following podcastGetRecentPodcasts...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        podcasts: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        podcasts: null,
      };
    }
  };

  /**
   * Gets all getRecentEpisodes from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastGetRecentEpisodes = async (
    page,
    pageSize,
  ): Promise<AllEpisodeResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getRecentEpisodesEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
      },
      cache: false,
    };

    try {
      console.debug("Sending the following podcastGetRecentEpisodes...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastGetRecentEpisodes...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        episode: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        episode: null,
      };
    }
  };

  /**
   * Gets all myPodcasts from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastUserPodcastsGet = async (userId, page, pageSize): Promise<MyPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastByUserIdEndpoint(userId, page, pageSize),
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
   * Gets all podcasts from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastAllPodcastsGet = async (page, pageSize): Promise<AllPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastAllPodcastsEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastAllPodcastsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastAllPodcastsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        podcasts: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        podcasts: null,
      };
    }
  };

  /**
   * Gets all podcasts by genre from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastByTagsPodcastsGet = async (page, pageSize, requestHeader: PodcastByTagsRequest): Promise<ByTagsPodcastResponse> => {
    // Create the request options.

    const options = {
      method: "get",
      url: EndpointHelper.getByTagsPodcastEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
        tags: requestHeader.tags,
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastAllPodcastsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastAllPodcastsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        podcasts: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        podcasts: null,
      };
    }
  };

  /**
   * Gets all podcasts by genre from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastSearchPodcastsGet = async (page, pageSize, requestData: PodcastSearchRequest): Promise<SearchPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Post",
      url: EndpointHelper.getSearchPodcastEndpoint(page, pageSize),
      data: requestData,
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastSearchPodcastsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastSearchPodcastsGet...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        podcasts: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        podcasts: null,
      };
    }
  };

  /**
   * Gets all podcasts by genre from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastSearchEpisodeGet = async (page, pageSize, requestData: EpisodeSearchRequest): Promise<SearchEpisodeResponse> => {
    // Create the request options.
    const options = {
      method: "Post",
      url: EndpointHelper.getSearchEpisodeEndpoint(page, pageSize),
      data: requestData,
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastSearchEpisodeGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastSearchEpisodeGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        episodes: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        episodes: null,
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
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void // Use AxiosProgressEvent here
  ): Promise<CreateEpisodeResponse> => {
    // Create the request options.
    const options: AxiosRequestConfig = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getEpisodeAddEndpoint(podcastId),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      onUploadProgress,
    };

    try {
      console.debug("Sending the following podcastCreateRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse: AxiosResponse = await axios(options);

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
   * Gets a podcast by podcastId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static getPodcastById = async (podcastId): Promise<GetMyPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastEndpoint(podcastId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following getPodcastById...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getPodcastById...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        podcast: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        podcast: null,
      };
    }
  };

  /**
   * Deletes a podcast by podcastId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static deletePodcast = async (podcastId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "Delete",
      url: EndpointHelper.getPodcastDeleteEndpoint(podcastId),
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

  /**
   * Edits a podcast in the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastEditRequest = async (requestData: PodcastEditRequest): Promise<EditPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getPodcastEditEndpoint(),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastEditRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastEditResponse...");
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
   * Gets a episode by episodeId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static getEpisodeById = async (episodeId): Promise<GetMyEpisodeResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPodcastEpisodeByIdEndpoint(episodeId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following getPodcastById...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getPodcastById...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        episode: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        episode: null,
      };
    }
  };

  /**
   * Deletes an episode by episodeId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static deleteEpisode = async (episodeId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "Delete",
      url: EndpointHelper.getPodcastEpisodeDeleteEndpoint(episodeId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following deleteEpisode...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following deleteEpisode...");
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
   * Edits a episode in the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static podcastEpisodeEditRequest = async (requestData: EpisodeEditRequest, episodeId): Promise<EditEpisodeResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getPodcastEpisodeEditEndpoint(episodeId),
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following podcastEpisodeEditRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following podcastEpisodeEditRequest...");
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
   * Gets an episode transcript by episodeId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static getTranscript = async (episodeId): Promise<GetTranscriptResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getTranscriptEndpoint(episodeId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following getTrasncript...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getTranscript...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        transcript: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response?.status,
        message: error.response?.statusText,
        transcript: null,
      };
    }
  };

  /**
   * Creates a swave watch history request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static saveWatchHistory = async (episodeId, requestData: SaveWatchHistoryRequest): Promise<BaseResponse> => {
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      data: requestData,
      url: EndpointHelper.saveWatchHistoryEndpoint(episodeId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following saveWatchHistory...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following saveWatchHistory...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      };
    } catch (error) {
      return {
        status: error.response?.status,
        message: error.response?.statusText,
      };
    }
  };

  /**
   * Gets an episode watch history by episodeId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static getWatchHistory = async (episodeId): Promise<GetWatchHistoryResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getWatchHistoryEndpoint(episodeId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following getWatchHistory...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getWatchHistory...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        watchHistory: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response?.status,
        message: error.response?.statusText,
        watchHistory: null,
      };
    }
  };

  /**
   * Gets a podcast metrics by podcastId from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static getMetrics = async (podcastId): Promise<GetMetricsResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getMetricsEndpoint(podcastId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following getMetrics...");
      console.debug(options);

      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getMetrics...");
      console.debug(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        metrics: requestResponse.data,
      };
    } catch (error) {
      return {
        status: error.response?.status,
        message: error.response?.statusText,
        metrics: null,
      };
    }
  };
}
