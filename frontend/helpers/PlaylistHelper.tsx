import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import EndpointHelper from "./EndpointHelper";
import { GetMyPlaylistsResponse } from "../utilities/Responses";

export default class PlaylistHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Gets all myPlaylists from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static playlistMyPlaylistsGet = async (
    page,
    pageSize,
  ): Promise<GetMyPlaylistsResponse> => {
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
}
