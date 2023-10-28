//#region Auth Requests

/**
 * Login Request to be sent to the server
 */
export interface LoginRequest{
    email: string;
    password: string;
}

/**
 * Register Request to be sent to the server
 */
export interface RegisterRequest extends LoginRequest{
    username: string;
    gender: string;
    dateOfBirth: string;
}

/**
 * Google SSO Request to be sent to the server
 */
export interface GoogleSSORequest{
    email: string;
    username: string;
    sub: string;
    avatar: string;
    token: string;
}

//#endregion


//#region User Profile Requests

export interface UserProfileSetupRequest{
    avatar: File;
    bio: string;
    interests: string[];
}

export interface UserProfileEditRequest{
    avatar:File;
    username: string;
    bio: string;
    interests: string[];
    twitterUrl: string;
    linkedInUrl: string;
    githubUrl: string;
}

//#endregion
