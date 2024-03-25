import axios from "axios";
import EndpointHelper from "./EndpointHelper";
import { BaseResponse } from "../types/Responses";
import { HighlightAddRequest, HighlightEditRequest } from "../types/Requests";
import { Episode, Highlight, Podcast } from "../types/Interfaces";

export default class HighlightHelper {

    static getBackendAddress = () => {
        if (
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
        )
          return process.env.NEXT_PUBLIC_BASE_URL;
        else return process.env.NEXT_PUBLIC_BASE_URL;
      };
      
    static getUserProfile() {
        throw new Error("Method not implemented.");
    }

    public static highlightCreateRequest = async (
        requestData: HighlightAddRequest,
        episodeId: string,
    ): Promise<BaseResponse> => {
        const formData = new FormData();
        formData.append("StartTime", requestData.StartTime.toString());
        formData.append("EndTime", requestData.EndTime.toString());
        formData.append("Title", requestData.Title);
        formData.append("Description", requestData.Description);
    
        const options = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                // "Content-Type": "multipart/form-data" is not needed here; axios will set it correctly based on formData
            },
            data: formData,
            url: EndpointHelper.addHighlightsEndpoint(episodeId),
            withCredentials: true,
            cache: false,
        };
    
        try {
            console.debug("Sending highlightCreateRequest with the following data:");
            console.debug("URL:", options.url);
    
            const requestResponse = await axios(options);
    
            console.debug("Received the following highlightCreateResponse:");
            console.debug(requestResponse);
    
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
        } catch (error) {
            console.error("Error in highlightCreateRequest:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }
    
            return {
                status: error.response ? error.response.status : 500,
                message: error.response ? error.response.statusText : "Unknown Error",
            };
        }
    };

    public static highlightEditRequest = async (
        requestData: HighlightEditRequest,
        highlightId: string,
    ): Promise<BaseResponse> => {
        // Create a FormData object and append your fields to it
        const formData = new FormData();
        formData.append('Title', requestData.Title);
        formData.append('Description', requestData.Description);
    
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
            },
            data: formData, // Use FormData object
            url: EndpointHelper.editHighlightsEndpoint(highlightId),
            withCredentials: true,
            cache: false,
        };
    
        try {
            console.debug("Sending highlightEditRequest with the following data:");
            console.debug("URL:", options.url);

            console.debug("FormData contains: Title and Description");
    
            const requestResponse = await axios(options);
    
            console.debug("Received the following highlightEditResponse:");
            console.debug(requestResponse);
    
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
        } catch (error) {
            console.error("Error in highlightEditRequest:");
            console.error("Request URL:", options.url);
            // Note: FormData contents can't be directly logged because it's sent as multipart/form-data
            console.error("FormData contains: Title and Description");
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }
    
            return {
                status: error.response ? error.response.status : 500,
                message: error.response ? error.response.statusText : "Unknown Error",
            };
        }
    }
    

    public static highlightDeleteRequest = async (
        highlightId,
    ): Promise<BaseResponse> => {
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.deleteHighlightsEndpoint(highlightId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending highlightDeleteRequest with the following data:");
            console.debug("URL:", options.url);

            const requestResponse = await axios(options);

            console.debug("Received the following highlightDeleteResponse:");
            console.debug(requestResponse);

            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
        } catch (error) {
            console.error("Error in highlightDeleteRequest:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }

            return {
                status: error.response ? error.response.status : 500,
                message: error.response ? error.response.statusText : "Unknown Error",
            };
        }
    }

    public static getUserHighlights = async (
        userId: string,
    ): Promise<Highlight[]> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getUserHighlightsEndpoint(userId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending getHighlights with the following data:");
            console.debug("URL:", options.url);

            const requestResponse = await axios(options);

            console.debug("Received the following getHighlights:");
            console.debug(requestResponse);

            return requestResponse.data;
        } catch (error) {
            console.error("Error in getHighlights:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }

            return [];
        }
    }

    public static getEpisodeHighlights = async (
        episodeId: string,
    ): Promise<Highlight[]> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getEpisodeHighlightsEndpoint(episodeId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending getEpisodeHighlights with the following data:");
            console.debug("URL:", options.url);

            const requestResponse = await axios(options);

            console.debug("Received the following getEpisodeHighlights:");
            console.debug(requestResponse);

            return requestResponse.data;
        } catch (error) {
            console.error("Error in getEpisodeHighlights:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }

            return [];
        }
    }

    public static getHighlightAudio = async (
        highlightId: string,
    ): Promise<Highlight[]> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getHighlightAudioEndpoint(highlightId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending getHighlightAudio with the following data:");
            console.debug("URL:", options.url);

            const requestResponse = await axios(options);

            console.debug("Received the following getHighlightAudio:");
            console.debug(requestResponse);

            return requestResponse.data;
        } catch (error) {
            console.error("Error in getHighlightAudio:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }

            return [];
        }
    }

    public static getHighlightAudioEndpoint = (highlightId: string) => {
        return this.getBackendAddress() + "/podcast/" + highlightId + "/GetHighlightAudio";
    };

    public static getRandomHighlights = async (
        quantity: number,
    ): Promise<Highlight[]> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
            },
            url: EndpointHelper.getRandomHighlightsEndpoint(quantity),
            withCredentials: true,
            cache: false,
        };
    
        try {
            console.debug("Sending getRandomHighlights with the following data:");
            console.debug("URL:", options.url);
    
            const requestResponse = await axios(options);
    
            console.debug("Received the following getRandomHighlights:");
            console.debug(requestResponse);
    
            return requestResponse.data;
        } catch (error) {
            console.error("Error in getRandomHighlights:");
            console.error("Request URL:", options.url);
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Response:", error.response.data);
            } else {
                console.error("Error Details:", error);
            }
    
            return [];
        }
    }
    

}