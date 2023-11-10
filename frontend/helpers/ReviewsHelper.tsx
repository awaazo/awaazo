import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import {
   PodcastRatingRequest,
   PodcastReviewRequest
} from "../utilities/Requests";
import {
   BaseResponse,
   GetMyPodcastResponse,
   MyPodcastResponse
} from "../utilities/Responses";

export default class ReviewsHelper {
   static getPodcastRating() {
      throw new Error("Method not implemented.");
   }

   /**
    * creates a new podcast review
    * @param requestData 
    * @param podcastId 
    * @returns 
    */
   // Post a new rating
   public static postPodcastRating = async (
      requestData: PodcastRatingRequest,

    ): Promise<BaseResponse> => {
      const options = {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json"
          // No Authorization header needed if using cookies for session
        },
        data: requestData, // No need to stringify if your server expects an object
        url: EndpointHelper.getPodcastRatingEndpoint(),
        withCredentials: true, // This will send the session cookie with the request
        cache: false
      };
    
      try {
         console.debug("Sending the following postPodcastRating...");
         console.debug(options);

         console.log(options);
         // Send the request and wait for the response.
         const requestResponse = await axios(options);

         console.debug("Received the following postPodcastRating...");
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
    
    public static deletePodcastRating = async (podcastId): Promise<BaseResponse> => {
      // Retrieve the token from local storage or your state management solution
      
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        url: EndpointHelper.getPodcastRatingDeleteEndpoint(podcastId),
        withCredentials: true,
        cache: false,
      };
    
      try {
         console.debug("Sending the following deletePodcastRating...");
         console.debug(options);

         console.log(options);
         // Send the request and wait for the response.
         const requestResponse = await axios(options);

         console.debug("Received the following deletePodcastRating...");
         console.debug(requestResponse);

         // Return the response.
         return {
            status: requestResponse.status,
            message: requestResponse.statusText,
         };
      } catch (error) {
         return {
            status: error.response.status,
            message: error.response.statusText,
         };
      }

    };

    // post a new review
    public static postPodcastReview = async (
      requestData: PodcastReviewRequest,

    ): Promise<BaseResponse> => {
      const options = {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json"
          // No Authorization header needed if using cookies for session
        },
        data: requestData, // No need to stringify if your server expects an object
        url: EndpointHelper.getPodcastReviewEndpoint(),
        withCredentials: true, // This will send the session cookie with the request
        cache: false
      };
    
      try {
         console.debug("Sending the following postPodcastReview...");
         console.debug(options);

         console.log(options);
         // Send the request and wait for the response.
         const requestResponse = await axios(options);

         console.debug("Received the following postPodcastReview...");
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

    // delete a review
    public static deletePodcastReview = async (podcastId): Promise<BaseResponse> => {
      // Retrieve the token from local storage or your state management solution
      
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        url: EndpointHelper.getPodcastReviewDeleteEndpoint(podcastId),
        withCredentials: true,
        cache: false,
      };
    
      try {
         console.debug("Sending the following deletePodcastReview...");
         console.debug(options);

         console.log(options);
         // Send the request and wait for the response.
         const requestResponse = await axios(options);

         console.debug("Received the following deletePodcastReview...");
         console.debug(requestResponse);

         // Return the response.
         return {
            status: requestResponse.status,
            message: requestResponse.statusText,
         };
      } catch (error) {
         return {
            status: error.response.status,
            message: error.response.statusText,
         };
      }

    };

 
    public static getPodcastById = async (
      podcastId,
    ): Promise<GetMyPodcastResponse> => {
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
  
}



   