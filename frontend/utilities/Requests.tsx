//#region Auth Requests

/**
 * Login Request to be sent to the server
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request to be sent to the server
 */
export interface RegisterRequest extends LoginRequest {
  username: string;
  gender: string;
  dateOfBirth: string;
}

/**
 * Google SSO Request to be sent to the server
 */
export interface GoogleSSORequest {
  email: string;
  name: string;
  avatar: string;
  sub: string;
  token: string;
}

//#endregion

//#region User Profile Requests

export interface UserProfileSetupRequest {
  displayName: string;
  avatar: File;
  bio: string;
  interests: string[];
}

export interface UserProfileEditRequest {
  avatar: File;
  username: string;
  displayName: string;
  bio: string;
  interests: string[];
  twitterUrl: string;
  linkedInUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

//#endregion

//#region Podcast Requests

export interface PodcastCreateRequest {
  name: string;
  coverImage: File;
  description: string;
  tags: string[];
}

export interface PodcastEditRequest {
  Id: string;
  name: string;
  coverImage: File;
  description: string;
  tags: string[];
}

export interface PodcastByTagsRequest {
  tags: string[];
}

//#endregion

//#region Episode Requests

export interface EpisodeAddRequest {
  audioFile: File;
  episodeName: String;
  description: String;
  thumbnail: File;
  isExplicit: boolean;
}

export interface EpisodeEditRequest {
  audioFile: File;
  episodeName: String;
  description: String;
  thumbnail: File;
  isExplicit: boolean;
}

//#endregion

//#region Podcast Rating Requests
export interface PodcastRatingRequest {
  podcastId: string;
  rating: number;
}

export interface PodcastReviewRequest {
  podcastId: string;
  review: string;
}
//#endregion
