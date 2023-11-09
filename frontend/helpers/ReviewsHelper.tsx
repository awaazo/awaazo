import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import {
   PodcastRatingRequest,
   PodcastRatingDeleteRequest,
   PodcastReviewRequest,
   PodcastReviewDeleteRequest
} from "../utilities/Requests";
import {
   BaseResponse,
   PodcastRatingResponse,
   PodcastReviewResponse
} from "../utilities/Responses";

export default class PodcastsHelper {
   static getPodcastRating() {
      return axios.get<PodcastRatingResponse>(EndpointHelper.getPodcastRatingEndpoint());
   }

   // Post a new rating
   public static postPodcastRating = async (
      requestData: PodcastRatingRequest,
    ): Promise<BaseResponse> => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // No Authorization header needed if using cookies for session
        },
        data: requestData, // No need to stringify if your server expects an object
        url: EndpointHelper.getPodcastRatingEndpoint(),
        withCredentials: true, // This will send the session cookie with the request
        cache: false
      };
    
      try {
        const response = await axios(options);
        return { status: response.status, message: "Rating saved." };
      } catch (error) {
        return {
          status: error.response ? error.response.status : 500,
          message: error.response ? error.response.data.message : "An error occurred"
        };
      }
    };
    
    public static deletePodcastRating = async (
      requestData: PodcastRatingDeleteRequest,
    ): Promise<BaseResponse> => {
      // Retrieve the token from local storage or your state management solution

      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        },
        data: requestData,
        url: EndpointHelper.getPodcastRatingDeleteEndpoint(),
        withCredentials: true,
        cache: false,
      };
    
      try {
        const response = await axios(options);
        return { status: response.status, message: "Rating deleted successfully." };
      } catch (error) {
        return {
          status: error.response ? error.response.status : 500,
          message: error.response ? error.response.data.message : "An error occurred"
        };
      }
    };
    

   public static deletePodcastReview = async (
      requestData: PodcastReviewDeleteRequest,
   ): Promise<BaseResponse> => {
      const options = {
         method: "DELETE",
         headers: { "content-type": "application/json" },
         data: requestData,
         url: EndpointHelper.getPodcastReviewEndpoint(),
         withCredentials: true,
         cache: false,
      };

      return axios(options);
   };

   public static getPodcastEndpoint = async (
      requestData: PodcastRatingRequest,
   ): Promise<BaseResponse> => {
      const options = {
         method: "GET",
         headers: { "content-type": "application/json" },
         data: requestData,
         url: EndpointHelper.getPodcastEndpoint(),
         withCredentials: true,
         cache: false,
      };

      return axios(options);
   }
}



   