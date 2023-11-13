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

export interface GoogleSSOResponse extends BaseResponse {}

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
export interface CreatePodcastResponse extends BaseResponse {
  data: string;
}

export interface EditPodcastResponse extends BaseResponse {
  data: string;
}

export interface MyPodcastResponse extends BaseResponse {
  myPodcasts: Podcast[];
}

export interface AllPodcastResponse extends BaseResponse {
  podcasts: Podcast[];
}

export interface ByTagsPodcastResponse extends BaseResponse {
  podcasts: Podcast[];
}

export interface SearchPodcastResponse extends BaseResponse {
  podcasts: Podcast[];
}

export interface GetMyPodcastResponse extends BaseResponse {
  podcast: Podcast;
}

//#endregion

//#region Podcast Responses
export interface CreateEpisodeResponse extends BaseResponse {
  data: string;
}

export interface EditEpisodeResponse extends BaseResponse {
  data: string;
}

export interface GetMyEpisodeResponse extends BaseResponse {
  episode: Episode;
}

//#endregion
