import { UserProfile } from "./Interfaces";

export interface BaseResponse{
    status: number;
    message: string;
}



//#region User Profile Responses

export interface UserProfileResponse extends BaseResponse{
    userProfile: UserProfile;
}

//#endregion