import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { 
   BaseResponse,
   GetMyEpisodeResponse,
 } from "../utilities/Responses";

export default class PlayingHelper {
   static getEpisode() {
      throw new Error("Method not implemented.");
   }

   // public static getEpisodePlaying = async (
   //    podcastId: string,
   //    episodeId: string,
   // ): Promise<BaseResponse> => {
   //    const url = EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId);
   //    const options = {
   //       method: "GET",
   //       headers: {
   //          accept: "*/*",
   //          "Content-Type": "application/json",
   //       },
   //       url: EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId),
   //       withCredentials: true, // This will send the session cookie with the request
   //       cache: false,
   //    };

   //    try{
   //       console.debug("Sending the following getEpisodePlaying...");
   //       console.debug(options);

   //       console.log(options);
   //       // Send the request and wait for the response.
   //       const requestResponse = await axios(options);

   //       console.debug("Received the following getEpisodePlaying...");
   //       console.debug(requestResponse);

   //       // Return the response.
   //       return {
   //          status: requestResponse.status,
   //          message: requestResponse.statusText,
   //       };
   //    } catch (error) {
   //       return {
   //          status: error.response?.status,
   //          message: error.response?.statusText,
   //       };
   //    }
   // };

   public static getEpisodePlaying = async (
      podcastId: string,
      episodeId: string
    ): Promise<string> => {
      // Construct the URL for the audio file
      const url = EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId);
  
      // Return the URL for the audio file
      return url;
    };
  


}
