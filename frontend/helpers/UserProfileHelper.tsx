import axios from "axios";
import { UserProfileSetupRequest } from "../utilities/Requests";
import EndpointHelper from "./EndpointHelper";
import { BaseResponse } from "../utilities/Responses";

export default class UserProfileHelper {

    /**
     * Saves the user's profile setup request to the server.
     * @param requestData Request data to be sent to the server.
     * @returns A BaseResponse object with the server's response.
     */
    public static profileSetupRequest =
        async (requestData: UserProfileSetupRequest): Promise<BaseResponse> => {
           
            // Create the request options.
            const options =
            {
                method: 'POST',
                data: requestData,
                url: EndpointHelper.getProfileSetupEndpoint(),
                headers:
                {
                    accept: '*/*',
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
                cache: false
            }

            try {
                console.debug("Sending the following profileSetupRequest...");
                console.debug(options);

                // Send the request and wait for the response.
                const requestResponse = await axios(options);

                console.debug("Received the following profileSetupResponse...");
                console.debug(requestResponse);

                // Return the response.
                return {
                    status: requestResponse.status,
                    message: requestResponse.statusText
                }
            }
            catch (error) {
                // Return the error.
                return {
                    status: error.response.status, 
                    message: error.response.statusText
                };
            }
        }


}