import { SetStateAction } from "react";
import { UserMenuInfo, UserProfile, Podcast, Episode } from "./Interfaces";

export interface BaseResponse {
  status: number;
  message: string;
}

//#region Auth Responses

export interface LoginResponse extends BaseResponse {
  data: string;
}

export interface RegisterResponse extends BaseResponse {
  data: string;
}

export interface GoogleSSOResponse extends BaseResponse {
  data: string;
}

export interface LogoutResponse extends BaseResponse {}

export interface MeResponse extends BaseResponse {
  userMenuInfo: UserMenuInfo;
}

//#endregion

//#region User Profile Responses

export interface UserProfileResponse extends BaseResponse {
  userProfile: UserProfile;
}

//#endregion


//#region Podcast Responses
export interface MyPodcastResponse extends BaseResponse {
  myPodcasts: Podcast[];
}

export interface GetMyPodcastResponse extends BaseResponse {
  podcast: Podcast;
}

//#endregion

//#region Podcast Responses

export interface GetMyEpisodeResponse extends BaseResponse {
  episode: Episode;
}

//#endregion
