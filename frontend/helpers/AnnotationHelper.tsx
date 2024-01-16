import Axios from 'axios';
import  EndpointHelper from './EndpointHelper';
import { BaseResponse, AddAnnotationResponse, getAnnotationResponse } from "../utilities/Responses";
import { AnnotationAddRequest } from "../utilities/Requests";

export default class AnnotationHelper {
    static getUserProfile() {
        throw new Error("Method not implemented.");
    }

    public static annotationCreateRequest = async (
        requestData: AnnotationAddRequest,
        episodeId,
    ): Promise<BaseResponse> => {
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            data: requestData,
            url: EndpointHelper.addAnnotationsEndpoint(episodeId),
            withCredentials: true,
            cache: false,
        };
    
        try {
            console.debug("Sending annotationCreateRequest with the following data:");
            console.debug("URL:", options.url);
            console.debug("Data:", options.data);
    
            const requestResponse = await Axios(options);
    
            console.debug("Received the following annotationCreateResponse:");
            console.debug(requestResponse);
    
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
        } catch (error) {
            console.error("Error in annotationCreateRequest:");
            console.error("Request URL:", options.url);
            console.error("Request Data:", options.data);
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
    

    public static mediaLinkAnnotationCreateRequest = async (
        requestData: AnnotationAddRequest,
        episodeId,
    ): Promise<AddAnnotationResponse> => {
        // Create the request options.
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            data: requestData,
            url: EndpointHelper.addMediaAnnotationsEndpoint(episodeId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending the following annotationCreateRequest...");
            console.debug(options);

            console.log(options);
            // Send the request and wait for the response.
            const requestResponse = await Axios(options);

            console.debug("Received the following annotationCreateResponse...");
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

    public static sponsorAnnotationCreateRequest = async (
        requestData: AnnotationAddRequest,
        episodeId,
    ): Promise<AddAnnotationResponse> => {
        // Create the request options.
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            data: requestData,
            url: `http://localhost:32773/annotation/${episodeId}/createSponserAnnotation`,
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending the following annotationCreateRequest...");
            console.debug(options);

            console.log(options);
            // Send the request and wait for the response.
            const requestResponse = await Axios(options);

            console.debug("Received the following annotationCreateResponse...");
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
    }

    public static getAnnotationsRequest = async (
        episodeId,
    ): Promise<getAnnotationResponse> => {
        // Create the request options.
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getAnnotationsEndpoint(episodeId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending the following getAnnotationsRequest...");
            console.debug(options);

            console.log(options);
            // Send the request and wait for the response.
            const requestResponse = await Axios(options);

            console.debug("Received the following getAnnotationsResponse...");
            console.debug(requestResponse);

            // Return the response.
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                annotations: requestResponse.data,
            };
        } catch (error) {
            // Return the error.
            return {
                status: error.response.status,
                message: error.response.statusText,
                annotations: error.response.data,
            };
        }
    };

    public static deleteAnnotationRequest = async (
        annotationId,
    ): Promise<BaseResponse> => {
        // Create the request options.
        const options = {
            method: "DELETE",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.deleteAnnotationEndpoint(annotationId),
            withCredentials: true,
            cache: false,
        };

        try {
            console.debug("Sending the following deleteAnnotationRequest...");
            console.debug(options);

            console.log(options);
            // Send the request and wait for the response.
            const requestResponse = await Axios(options);

            console.debug("Received the following deleteAnnotationResponse...");
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
    }

}