import { SetStateAction } from "react";
import { UserMenuInfo, UserProfile } from "./Interfaces";

export interface BaseResponse{
    status: number;
    message: string;
}


//#region Auth Responses


export interface LoginResponse extends BaseResponse{
    data: string;
}

export interface RegisterResponse extends BaseResponse{
    data: string;
}

export interface GoogleSSOResponse extends BaseResponse{

}

export interface LogoutResponse extends BaseResponse{
}

export interface MeResponse extends BaseResponse{
    UserProfile: SetStateAction<UserProfile>;
    userMenuInfo: UserMenuInfo;
}

//#endregion




//#region User Profile Responses

export interface UserProfileResponse extends BaseResponse{
    userMenuInfo: any;
    userProfile: UserProfile;
}

//#endregion