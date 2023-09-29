import axios from 'axios'


/**
 * Default API Response Object.
 */
export interface ResponseInfo {
    status: number;
    data: JSON;
} 

/**
 * Handles API calls to the backend.
 */
export default class RequestHelper {

    /**
     * Sends a GET Request to the requested URL with given parameters.
     * @param requestUrl Requested URL
     * @param requestParams Parameters as a JSON object
     * @returns ResponseInfo Object containing the response's status and data. 
     */
    static getRequest = async (
        requestUrl: string,
        requestParams: JSON
    ): Promise<ResponseInfo> => {
        
        // Build the request's options.
        const options = {
            method: 'GET',
            url: requestUrl,
            params: requestParams,
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following GetRequest...")
        console.debug(options)

        // Send the request and wait for the response.
        const requestResponse = await axios.request(options);
        
        console.debug("Received the following response...")
        console.debug(requestResponse)

        // Return the response's status and data.
        return { status: requestResponse.status, data: requestResponse.data }
    };

    /**
     * Sends a POST Request to the requested URL with given parameters and body.
     * @param requestUrl Requested URL
     * @param requestParams Parameters as a JSON object
     * @param data Data of the body as a JSON object
     * @returns ResponseInfo Object containing the response's status and data. 
     */
    static postRequest = async (
        requestUrl: string,
        requestParams: JSON,
        data: JSON
    ): Promise<ResponseInfo> => {
        
        // Build the request's options.
        const options = {
            method: 'POST',
            url: requestUrl,
            params: requestParams,
            data: data,
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following PostRequest...")
        console.debug(options)

        // Send the request and wait for the response.
        const requestResponse = await axios.request(options);
        
        console.debug("Received the following response...")
        console.debug(requestResponse)

        // Return the response's status and data.
        return { status: requestResponse.status, data: requestResponse.data }
    };

    /**
     * Sends a PUT Request to the requested URL with given parameters and body.
     * @param requestUrl Requested URL
     * @param requestParams Parameters as a JSON object
     * @param data Data of the body as a JSON object
     * @returns ResponseInfo Object containing the response's status and data. 
     */
    static putRequest = async (
        requestUrl: string,
        requestParams: JSON,
        data: JSON
    ): Promise<ResponseInfo> => {
        
        // Build the request's options.
        const options = {
            method: 'PUT',
            url: requestUrl,
            params: requestParams,
            data: data,
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following PutRequest...")
        console.debug(options)

        // Send the request and wait for the response.
        const requestResponse = await axios.request(options);
        
        console.debug("Received the following response...")
        console.debug(requestResponse)

        // Return the response's status and data.
        return { status: requestResponse.status, data: requestResponse.data }
    };

    /**
     * Sends a DELETE Request to the requested URL with given parameters.
     * @param requestUrl Requested URL
     * @param requestParams Parameters as a JSON object
     * @returns ResponseInfo Object containing the response's status and data. 
     */
    static deleteRequest = async (
        requestUrl: string,
        requestParams: JSON
    ): Promise<ResponseInfo> => {
        
        // Build the request's options.
        const options = {
            method: 'DELETE',
            url: requestUrl,
            params: requestParams,
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following DeleteRequest...")
        console.debug(options)

        // Send the request and wait for the response.
        const requestResponse = await axios.request(options);
        
        console.debug("Received the following response...")
        console.debug(requestResponse)

        // Return the response's status and data.
        return { status: requestResponse.status, data: requestResponse.data }
    };

    /**
     * Sends a POST Request to the /auth/register endpoint with given parameters.
     * @param email User email
     * @param password User password
     * @param dateOfBirth User date of birth
     * @returns ResponseInfo Object containing the response's status and data.
     */
    static authRegisterRequest = async (
        email: string,
        password: string,
        dateOfBirth: string
    ): Promise<ResponseInfo> => {

        // Build the request's options.
        const options = {
            method: 'POST',
            url: EndpointHelper.getAuthRegisterEndpoint(),
            data: { email: email, password: password, dateOfBirth: dateOfBirth },
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following authRegisterRequest...")
        console.debug(options)

        try {
            // Send the request and wait for the response.
            const requestResponse = await axios.request(options);
        
            console.debug("Received the following response...")
            console.debug(requestResponse)

            // Return the response's status and data.
            return { status: requestResponse.status, data: requestResponse.data }
        }
        catch (error) {
            return { status: error.response.status, data: error.response.data }
        }
    };

    /**
     * Sends a POST Request to the /auth/login endpoint with given parameters.
     * @param email User email
     * @param password User password
     * @returns ResponseInfo Object containing the response's status and data.
     */
    static authLoginRequest = async (
        email: string,
        password: string
    ): Promise<ResponseInfo> => {

        // Build the request's options.
        const options = {
            method: 'POST',
            url: EndpointHelper.getAuthLoginEndpoint(),
            data: { email: email, password: password },
            headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
        }
        
        console.debug("Sending the following authLoginRequest...")
        console.debug(options)

        try {
            // Send the request and wait for the response.
            const requestResponse = await axios.request(options);
        
            console.debug("Received the following response...")
            console.debug(requestResponse)

            // Return the response's status and data.
            return { status: requestResponse.status, data: requestResponse.data }
        }
        catch (error) {
            return { status: error.response.status, data: error.response.data }
        }
    };
}

/**
 * Provides the appropriate backend endpoints, depending on the environment
 */
export class EndpointHelper{

    /**
     * Returns the address of the backend, which will vary 
     * depending on the environment.
     * @returns The address of the backend
     */
    static getBackendAddress = () => {
        if(process.env.NODE_ENV==='development' || process.env.NODE_ENV==='test')
            return "http://localhost:32773";
        else
            return "http://backend:32773";
    }
    

    /**
     * Returns the backend login endpoint.
     * @returns The Login API Endpoint
     */
    static getAuthLoginEndpoint = () => {
        return this.getBackendAddress() + "/auth/login";
    }

    /**
     * Returns the backend register endpoint.
     * @returns The Register API Endpoint
     */
    static getAuthRegisterEndpoint = () => {
        return this.getBackendAddress() + "/auth/register";
    }
    
}