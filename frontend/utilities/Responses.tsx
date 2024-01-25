import {
  UserMenuInfo,
  UserProfile,
  Podcast,
  Episode,
  userProfileByID,
  User,
  Bookmark,
  Section,
  Playlist,
  TranscriptLine,
  Annotation,
  WatchHistory,
  Metrics,
} from "./Interfaces";

export interface BaseResponse<T = undefined> {
  status: number;
  message: string;
  data?: T;
}

// Auth Responses
export interface LoginResponse extends BaseResponse<string> {}
export interface RegisterResponse extends BaseResponse<string> {}
export interface GoogleSSOResponse extends BaseResponse<string> {}
export interface LogoutResponse extends BaseResponse {}
export interface MeResponse extends BaseResponse<UserMenuInfo> {}

// User Profile Responses
export interface UserProfileResponse extends BaseResponse<UserProfile> {}
export interface UserProfileByIdResponse
  extends BaseResponse<userProfileByID> {}

// Podcast Responses
export interface CreatePodcastResponse extends BaseResponse<string> {}
export interface EditPodcastResponse extends BaseResponse<string> {}
export interface MyPodcastResponse extends BaseResponse<Podcast[]> {}
export interface AllPodcastResponse extends BaseResponse<Podcast[]> {}
export interface ByTagsPodcastResponse extends BaseResponse<Podcast[]> {}
export interface SearchPodcastResponse extends BaseResponse<Podcast[]> {}
export interface GetMyPodcastResponse extends BaseResponse<Podcast> {}
export interface GetChangePasswordResponse extends BaseResponse<string> {}

//Search Responses
export interface SearchProfilesResponse extends BaseResponse {
  users: User[];
}

// Episode Responses
export interface CreateEpisodeResponse extends BaseResponse<string> {}
export interface EditEpisodeResponse extends BaseResponse<string> {}
export interface GetMyEpisodeResponse extends BaseResponse<Episode> {}

// Notification Responses
export interface NotificationResponse extends BaseResponse<Notification[]> {}

// Social Responses
export interface IsLikedResponse extends BaseResponse<boolean> {}

// Bookmark Responses
export interface GetBookmarksResponse extends BaseResponse<Bookmark[]> {}

// Section Responses
export interface AddSectionResponse extends BaseResponse<string> {}
export interface GetSectionResponse extends BaseResponse<Section[]> {}

// Annotation Responses
export interface AddAnnotationResponse extends BaseResponse<string> {}
export interface GetAnnotationResponse extends BaseResponse<Annotation[]> {}

// Playlist Responses
export interface PlaylistDataResponse extends BaseResponse<string> {}
export interface GetPlaylistsResponse extends BaseResponse<Playlist[]> {}
export interface GetPlaylistEpisodesResponse extends BaseResponse<Playlist> {}

// Transcript Response
export interface GetTranscriptResponse extends BaseResponse<TranscriptLine[]> {}

// Watch History Response
export interface GetWatchHistoryResponse extends BaseResponse<WatchHistory> {}

// Metrics Responses
export interface GetMetricsResponse extends BaseResponse<Metrics> {}
