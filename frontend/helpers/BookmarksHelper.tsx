import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { EpisodeBookmarkRequest } from "../types/Requests";
import { BaseResponse, GetBookmarksResponse } from "../types/Responses";

export default class BookmarksHelper {

  /**
   * creates a new episode comment
   * @param requestData
   * @param episodeId
   * @returns
   */


  // Post a new episode bookmark
  public static postBookmark = async (
    episodeId,
    requestData: EpisodeBookmarkRequest,
    
  ): Promise<BaseResponse> => {
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      data: requestData,
      url: EndpointHelper.getBookmarkAddEndpoint(episodeId),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      console.debug("Sending the following postEpisodeBookmark...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following postEpisodeBookmark...");
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

  // Get all episode bookmarks
public static getAllBookmarks = async (
  episodeId,
  ): Promise<GetBookmarksResponse> => {
  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    url: EndpointHelper.getBookmarksEndpoint(episodeId),
    withCredentials: true, // This will send the session cookie with the request
    cache: false,
  };

  try {
    console.debug("Sending the following getAllBookmarks...");
    console.debug(options);

    // Send the request and wait for the response.
    const requestResponse = await axios(options);

    console.debug("Received the following getAllBookmarks...");
    console.debug(requestResponse);

    // Return the response.
    return {
      status: requestResponse.status,
      message: requestResponse.statusText,
      bookmarks: requestResponse.data,
    };
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.statusText,
      bookmarks: null,
    };
  }
};

 // Delete an episode bookmark
 public static deleteEpisodeBookmark = async (
  bookmarkId,
): Promise<BaseResponse> => {
  const options = {
    method: "DELETE",
    url: EndpointHelper.getBookmarkDeleteEndpoint(bookmarkId),
    headers: {
      accept: "*/*",
    },
    withCredentials: true,
    cache: false,
  };

  try {
    console.debug("Sending the following deleteEpisodeBookmark...");
    console.debug(options);

    console.log(options);
    // Send the request and wait for the response.
    const requestResponse = await axios(options);

    console.debug("Received the following deleteEpisodeBookmark...");
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