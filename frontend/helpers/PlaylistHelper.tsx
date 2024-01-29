import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { BaseResponse, GetPlaylistEpisodesResponse, GetPlaylistsResponse, PlaylistDataResponse } from "../utilities/Responses";
import { PlaylistCreateRequest, PlaylistEditRequest } from "../utilities/Requests";

export default class PlaylistHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a new playlist request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
 public static playlistCreateRequest = async (
  requestData: PlaylistCreateRequest,
): Promise<PlaylistDataResponse> => {
 

  const options = {
    method: "POST",
    data: requestData,
    url: EndpointHelper.getCreatePlaylistEndpoint(),
    headers: {
      accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    cache: false,
  };
    try {
      console.debug("Sending the following playlistCreateRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistCreateRequest...");
      console.debug(requestResponse);
      console.log(requestResponse);

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      };
    } catch (error) {
      console.log(error);
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: error.response.data,
      };
    }
  };

  /**
   * Creates a new playlist edit request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistEditRequest = async (requestData: PlaylistEditRequest, playlistId): Promise<PlaylistDataResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getEditPlaylistEndpoint(playlistId),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistEditRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistEditRequest...");
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
   * Creates a new playlist add episode request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistAddEpisodeRequest = async (requestData, playlistId): Promise<PlaylistDataResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.getAddToPlaylistEndpoint(playlistId),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistAddEpisodeRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistAddEpisodeRequest...");
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
   * Creates a new playlist remove episode request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistRemoveEpisodeRequest = async (requestData, playlistId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "DELETE",
      data: requestData,
      url: EndpointHelper.getRemoveFromPlaylistEndpoint(playlistId),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistRemoveEpisodeRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistRemoveEpisodeRequest...");
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
   * Creates a new playlist delete request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistDeleteRequest = async (playlistId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: "DELETE",
      url: EndpointHelper.getDeletePlaylistEndpoint(playlistId),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistRemoveEpisodeRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistRemoveEpisodeRequest...");
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
   * Gets all myPlaylists from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistMyPlaylistsGet = async (page, pageSize): Promise<GetPlaylistsResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getMyPlaylistsEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistMyPlaylistsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistMyPlaylistsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        playlists: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        playlists: null,
      };
    }
  };

  /**
   * Gets all UserPlaylists from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistsUserPlaylistsGet = async (userId, page, pageSize): Promise<GetPlaylistsResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getUserPlaylistsEndpoint(userId, page, pageSize),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistsUserPlaylistsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistsUserPlaylistsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        playlists: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        playlists: null,
      };
    }
  };

  /**
   * Gets all episodes of a playlist from the server.
   * @returns A GetPlaylistEpisodesResponse object with the server's response.
   */
  public static playlistsEpisodesGet = async (playListId): Promise<GetPlaylistEpisodesResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getPlaylistEpisodesEndpoint(playListId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistsUserPlaylistsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistsUserPlaylistsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        playlist: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        playlist: null,
      };
    }
  };

  /**
   * Gets all liked episodes from the server.
   * @returns A GetPlaylistEpisodesResponse object with the server's response.
   */
  public static playlistsLikedEpisodesGet = async (): Promise<GetPlaylistEpisodesResponse> => {
    // Create the request options.
    const options = {
      method: "Get",
      url: EndpointHelper.getLikedEpisodesPlaylistEndpoint(),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following playlistsUserPlaylistsGet...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following playlistsUserPlaylistsGet...");
      console.debug(requestResponse);
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        playlist: requestResponse.data,
      };
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        playlist: null,
      };
    }
  };
}
