import RestHelper, { UserInfo } from "./RestHelper";
import jwt_decode from 'jwt-decode';


/**
 * Interface for the decoded token
 */
export interface DecodedToken{
    aud: string;
    exp: number;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
    iss: string;
}

/**
 * Handles the Authentication process with the Backend.
 */
export default class AuthHelper{

    /**
     * Sets the JWT token in the local storage
     * @param token JWT Token
     */
    private static setToken(token:any){
        if(typeof window !== 'undefined')
            localStorage.setItem('token', token);
    };

    /**
     * Gets the JWT Token from local storage. 
     * @returns The JWT Token if it exists, else null.
     */
    private static getToken(){
        if(typeof window !== 'undefined')
        {
            // Return null if there is no token.
            if(!localStorage.getItem('token'))
                return null;
            else
            {
                // Check if the token is expired.
                // If expired, remove it from local storage.
                // Otherwise, return the token.
                const decoded = jwt_decode(localStorage.getItem('token')) as DecodedToken;
                if(decoded.exp < Date.now() / 1000)
                {
                    console.log("Token expired");
                    this.removeToken();
                    return null;
                }
                return localStorage.getItem('token');
            }
            
        }
    };

    /**
     * Removes the JWT Token from local storage.
     */
    private static removeToken(){
        if(typeof window !== 'undefined')
            localStorage.removeItem('token');
    };

    /**
     * Handles the User Login Process with the Backend.
     * @param email The user's email address. 
     * @param password The user's password. 
     * @returns True if the user successfuly logged in, otherwise false.
     */
    public static login = async (email: string, password: string): Promise<boolean> =>
    {
        // Send the request.
        const res = await RestHelper.authLoginRequest(email,password);

        // Successful login.
        if(res.status === 200){
            console.debug("Login Successful")
            this.setToken(res.data.token);
            return true;
        }
        // Unsuccessful login.
        else{
            console.error("Login Failed")
            return false;
        }
    };

    /**
     * Handles the User Registration Process with the Backend.
     * @param email User's email address. 
     * @param password User's password. 
     * @param username User's username. 
     * @param dateOfBirth User's date of birth. 
     * @returns True if the user successfuly registered, otherwise false.
     */
    public static register = async (email: string, password: string, username: string, dateOfBirth: string): Promise<boolean> =>
    {
        // Set default gender
        const default_gender = "None";

        // Make Date of Birth into a Date object Format
        dateOfBirth = new Date(dateOfBirth).toISOString();

        const res = await RestHelper.authRegisterRequest(email,password,dateOfBirth,default_gender,username);

        if(res.status === 200){
            console.debug("Registration Successful")
            this.setToken(res.data.token);
            return true;
        }
        else{
            console.error("Registration Failed")
            return false;
        }
    };

    /**
     * Logs out the user by removing the JWT token from local storage.
     */
    public static logout = (): void => {
        this.removeToken();
        console.log("logged out");
    };

    
    /**
     * Returns the user info of the currently logged in user.
     * @returns User Info,  or null if the user is not logged in.
     */
    public static getUser = async (): Promise<UserInfo> =>
    {
        const res = await RestHelper.authMeRequest(this.getToken());

        if(res.status === 200){
            return res.user;
        }
        else{
            return null; // Should never happen.
        }
    };

    /**
     * Checks if the user is logged in.
     * @returns True if the user is logged in, false otherwise.
     */
    public static isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token; // Double negation to convert to boolean
    };

}