import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { EpisodeCommentRequest } from "../utilities/Requests";
import {
  BaseResponse,
  GetMyPodcastResponse,
  MyPodcastResponse,
  GetMyEpisodeResponse,
} from "../utilities/Responses";
import { request } from "http";

export default class SocialHelper {
  static getEpisodeComments() {
    throw new Error("Method not implemented.");
  }

  /**
   * creates a new episode comment
   * @param requestData
   * @param episodeId
   * @param replyToCommentId
   * @param commentId
   * @returns
   */

  // Post a new comment
  public static postEpisodeComment = async (
    requestData: EpisodeCommentRequest,
    episodeOrCommentId,
  ): Promise<BaseResponse> => {
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      data: requestData,
      url: EndpointHelper.getEpisodeCommentEndpoint(episodeOrCommentId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following postEpisodeComment...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following postEpisodeComment...");
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

  public static deleteComment = async (commentId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "DELETE",
      url: EndpointHelper.getEpisodeCommentDeleteEndpoint(commentId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following deleteComment...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following deleteComment...");
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

  // Post a new like
  public static postEpisodeLike = async (
    episodeOrCommentId,
  ): Promise<BaseResponse> => {
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getEpisodeLikeEndpoint(episodeOrCommentId),
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following postEpisodeLike...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following postEpisodeLike...");
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

  // Delete a like
  public static deleteEpisodeLike = async (
    episodeOrCommentId,
  ): Promise<BaseResponse> => {
    const options = {
      method: "DELETE",
      url: EndpointHelper.getEpisodeUnlikeEndpoint(episodeOrCommentId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following deleteEpisodeLike...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following deleteEpisodeLike...");
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
}
