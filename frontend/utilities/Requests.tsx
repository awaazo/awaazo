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
