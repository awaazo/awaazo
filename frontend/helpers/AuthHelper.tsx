import axios from "axios";
import { BaseResponse, GoogleSSOResponse, LoginResponse, LogoutResponse, MeResponse, RegisterResponse, GetResetPasswordResponse } from "../types/Responses";
import EndpointHelper from "./EndpointHelper";
import { GoogleSSORequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from "../types/Requests";




/**
 * Handles the Authentication process with the Backend.
 */
export default class AuthHelper {

    /**
     * Logs the user out of the application.
     * @returns A BaseResponse object with the server's response.
     */
    public static authLogoutRequest = async (): Promise<LogoutResponse> => {

        if (window) {
            window.sessionStorage.removeItem("userInfo")
        }

        // Create the request options.
        const options =
        {
            method: 'GET',
            url: EndpointHelper.getAuthLogoutEndpoint(),
            headers:
            {
                accept: '*/*',
            },
            withCredentials: true
        }

        try {
            console.debug("Sending the following authLogoutRequest...");
            console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following authLogoutResponse...");
            console.debug(requestResponse);

            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText
            }
        }
        catch (error) {
            console.error("An error occurred during logout: ", error);
    
            // Initialize default error response
            let errorResponse = {
                status: 500, // Default to internal server error
                message: "An unknown error occurred"
            };
    
            // Check if the error has a response object
            if (error.response) {
                // Use the error details from the response
                errorResponse.status = error.response.status;
                errorResponse.message = error.response.statusText;
            } else if (error.code === 'ECONNABORTED') {
                // Handle the aborted request
                errorResponse.status = 0;
                errorResponse.message = "The request was aborted";
            } else if (error.request) {
                // Handle no response
                errorResponse.message = "No response was received";
            } else if (error.message) {
                // Use the error message from the error object
                errorResponse.message = error.message;
            }
    
            return errorResponse;
        }
    }


    public static authLoginRequest = async (requestData: LoginRequest): Promise<LoginResponse> => {
        // Create the request options.
        const options =
        {
            method: 'POST',
            url: EndpointHelper.getAuthLoginEndpoint(),
            data: requestData,
            headers:
            {
                accept: '*/*',
                "Content-Type": "application/json"
            },
            withCredentials: true
        }

        try {
            console.debug("Sending the following authLoginRequest...");
            console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following authLoginResponse...");
            console.debug(requestResponse);

            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                data: requestResponse.data
            }
        }
        catch (error) {
            console.log(error)
            return {
                status: error.response.status,
                message: error.response.statusText,
                data: error.response.data
            }
        }
    }

    public static authRegisterRequest = async (requestData: RegisterRequest): Promise<RegisterResponse> => {
        // Create the request options.
        const options =
        {
            method: 'POST',
            url: EndpointHelper.getAuthRegisterEndpoint(),
            data: requestData,
            headers:
            {
                accept: '*/*',
                "Content-Type": "application/json"
            },
            withCredentials: true
        }

        try {
            console.debug("Sending the following authRegisterRequest...");
            console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following authRegisterResponse...");
            console.debug(requestResponse);

            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                data: requestResponse.data
            }
        }
        catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
                data: error.response.data
            }
        }
    }

    public static authMeRequest = async (): Promise<MeResponse> => {
        // Create the request options.
        const options =
        {
            method: 'GET',
            url: EndpointHelper.getAuthMeEndpoint(),
            headers:
            {
                accept: '*/*'
            },
            withCredentials: true
        }

        try {
            console.debug("Sending the following authMeRequest...");
            console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following authMeResponse...");
            console.debug(requestResponse);

            if (window) {
                window.sessionStorage.setItem("userInfo", JSON.stringify(requestResponse.data))
            }

            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                userMenuInfo: requestResponse.data,
            }
        }
        catch (error) {

            return {
                status: error.response.status,
                message: error.response.statusText,
                userMenuInfo: null
            }
        }
    }

    public static forgotPassword = async (email: string): Promise<BaseResponse> => {
        // Create the request options.
        const options = {
            method: 'POST',
            url: EndpointHelper.getForgotPasswordEndpoint(),
            headers: {
                accept: '*/*',
                "Content-Type": "application/json" // Ensure this line is correctly set
            },
            data: JSON.stringify({ email }), // Make sure the email is correctly formatted as JSON
            withCredentials: true
        };
        try {
            console.debug("Sending the following getForgotPasswordEndpoint...");
            console.debug(options);
    
            // Send the request and wait for the response.
            const requestResponse = await axios(options);
    
            console.debug("Received the following getForgotPasswordEndpoint response data:");
            console.debug(requestResponse.data); // Log the response data
    
            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,

            };
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            return {
                status: error.response ? error.response.status : 500,
                message: error.response ? error.response.statusText : "An unknown error occurred",

            };
        }
    }

    public static checkEmail = async (email: string): Promise<BaseResponse> => {
        // Create the request options.
        const options =
        {
            method: 'GET',
            url: EndpointHelper.getCheckEmailEndpoint(),
            data: { email: email },
            headers:
            {
                accept: '*/*',
                "Content-Type": "application/json"
            },
            withCredentials: true
        }
        try {
            console.debug("Sending the following getCheckEmailEndpoint...");
            console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following getCheckEmailEndpoint...");
            console.debug(requestResponse);

            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText
            }
        }
        catch (error) {

            return {
                status: error.response.status,
                message: error.response.statusText
            }
        }
    }




    /**
     * Sends a Google SSO request to the backend.
     * @param requestData GoogleSSORequest
     * @returns GoogleSSOResponse
     */
    public static loginGoogleSSO = async (requestData: GoogleSSORequest): Promise<GoogleSSOResponse> => {
        // Create the request options.
        const options =
        {
            method: 'POST',
            url: EndpointHelper.getGoogleSSOEndpoint(),
            data: requestData,
            headers:
            {
                accept: '*/*',
                "Content-Type": "application/json"
            },
            withCredentials: true
        }

        try {
            console.debug("Sending the following authGoogleSSORequest...");
            //console.debug(options);

            // Send the request and wait for the response.
            const requestResponse = await axios(options);

            console.debug("Received the following authGoogleSSOResponse...");
            console.debug(requestResponse);


            // Return the response
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                data: requestResponse.data
            }
        }
        catch (error) {

            return {
                status: error.response.status,
                message: error.response.statusText,
                data: error.response.data
            }
        }

    }


    public static resetPassword = async (requestData: { email: string; token: string; newPassword: string; confirmNewPassword: string }): Promise<any> => {
        const options = {
            method: "POST",
            url: "/profile/resetPassword", // Adjust if you have a different method to get the endpoint
            data: requestData,
            headers: {
                accept: "*/*",
                "Content-Type": "application/json"
            },
            withCredentials: true,
            cache: false,
        };
    
        try {
            console.debug("Sending the following resetPasswordRequest...");
            console.debug(options);
    
            const requestResponse = await axios(options);
    
            console.debug("Received the following resetPasswordResponse...");
            console.debug(requestResponse);
    
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                data: requestResponse.data
            }
        } catch (error) {
            console.error("Error in resetPassword:", error);
            return {
                status: error.response ? error.response.status : 500,
                message: error.response ? error.response.statusText : "An unknown error occurred",
                data: error.response ? error.response.data : {}
            }
        }
    };

}