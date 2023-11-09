import { SetStateAction } from "react";
import { UserMenuInfo, UserProfile, PodcastReview, PodcastRating } from "./Interfaces";

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
    userMenuInfo: UserMenuInfo;
}

//#endregion




//#region User Profile Responses

export interface UserProfileResponse extends BaseResponse{
    userProfile: UserProfile;
}

//#endregion


//#region Podcast Rating Responses
export interface PodcastRatingResponse extends BaseResponse{
    podcastRating: PodcastRating;
}

export interface PodcastReviewResponse extends BaseResponse{
    podcastReview: PodcastReview;
}
//#endregion