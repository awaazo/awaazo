import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import {
  AllEpisodeResponse,
  AllPodcastResponse,
  BaseResponse,
  GetMyEpisodeResponse,
  GetPlaylistEpisodesResponse,
  GetPlaylistsResponse,
  Last5DaysBalanceResponse,
  PlaylistDataResponse,
  TransactionResponse,
  WithdrawResponse,
  confirmPaymentResponse,
  createPaymentResponse,
  getUserBalance,
} from "../types/Responses";
import {
  PlaylistCreateRequest,
  PlaylistEditRequest,
  confirmPayment,
  createPayment,
} from "../types/Requests";
import UserProfileHelper from "./UserProfileHelper";
import { Episode, Transaction } from "../types/Interfaces";

export default class PaymentHelper {
  static getUserProfile() {
    throw new Error("Method not implemented.");
  }

  /**
   * Creates a new  payment request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static createPayment = async (
    requestData: createPayment
  ): Promise<createPaymentResponse> => {
    const options = {
      method: "POST",
      url: EndpointHelper.createPaymentEndpoint(
        requestData.episodeId,
        requestData.points
      ),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };
    try {
      console.debug("Sending the CreatePayment Request...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following CreatePaymentRequest...");
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
  public static confirmPayment = async (
    requestData: confirmPayment
  ): Promise<confirmPaymentResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      data: requestData,
      url: EndpointHelper.confirmPaymentEndpoint(requestData.pointId),
      headers: {
        accept: "*/*",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following confirmPaymentRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following confirmPaymentRequest...");
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
   * Gets User Balance
   * @returns A BaseResponse object with the server's response.
   */
  public static getUserBalanceRequest = async (): Promise<getUserBalance> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getUserBalanceEndpoint(),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following getUserBalanceRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following getUserBalanceRequest...");
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
   * Withdraws amount
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static WithdrawRequest = async (
    requestData: number
  ): Promise<WithdrawResponse> => {
    // Create the request options.
    const options = {
      method: "POST",
      url: EndpointHelper.withdrawBalanceEndpoint(requestData),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following WithdrawRequest...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following WithdrawRequest...");
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
   * Gets All the Transactions
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static GetAllTransactions = async (
    page: number,
    pageSize: number
  ): Promise<TransactionResponse> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getAllTransactionEndpoint(page, pageSize),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following GetAllTransactions...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      await Promise.all(
        requestResponse.data.map(async (element: Transaction) => {
          if (element.type === "Gift") {
            try {
              const res = await UserProfileHelper.profileGetByIdRequest(
                element.senderId
              );
              if (res.status == 200) {
                element.senderName = res.userProfileByID.username;
              }
            } catch (error) {
              console.error("Error fetching sender profile:", error);
            }
          }
        })
      );

      console.debug("Received the following GetAllTransactions...");

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
   * Gets last 5 days Balance
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static GetLast5DaysBalance =
    async (): Promise<Last5DaysBalanceResponse> => {
      // Create the request options.
      const options = {
        method: "GET",
        url: EndpointHelper.getLast5DaysBalance(),
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        cache: false,
      };

      try {
        console.debug("Sending the following GetLast5DaysBalance...");
        console.debug(options);

        console.log(options);
        // Send the request and wait for the response.
        const requestResponse = await axios(options);

        console.debug("Received the following GetLast5DaysBalanced...");

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
   * Gets last 5 days Earning
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static GetLast5DaysEarnings =
    async (): Promise<Last5DaysBalanceResponse> => {
      // Create the request options.
      const options = {
        method: "GET",
        url: EndpointHelper.getLast5DaysEarning(),
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        cache: false,
      };

      try {
        console.debug("Sending the following GetLast5DaysEarnings...");
        console.debug(options);

        console.log(options);
        // Send the request and wait for the response.
        const requestResponse = await axios(options);

        console.debug("Received the following GetLast5DaysEarnings...");

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
   * Gets Highest Earning Episode
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static GetHighestEarningEpisodes = async (
    page,
    pageSize
  ): Promise<AllEpisodeResponse> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getHighestEarningEpisode(page, pageSize),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following GetHighestEarningEpisodes...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following GetHighestEarningEpisodes...");

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
        episode: error.response.data,
      };
    }
  };

  /**
   * Gets Highest Earning Podcast
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static GetHighestEarningPodcast = async (
    page,
    pageSize
  ): Promise<AllPodcastResponse> => {
    // Create the request options.
    const options = {
      method: "GET",
      url: EndpointHelper.getHighestEarningPodcast(page, pageSize),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      cache: false,
    };

    try {
      console.debug("Sending the following GetHighestEarningPodcast...");
      console.debug(options);

      console.log(options);
      // Send the request and wait for the response.
      const requestResponse = await axios(options);

      console.debug("Received the following GetHighestEarningPodcast...");

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
        podcasts: error.response.data,
      };
    }
  };
}
