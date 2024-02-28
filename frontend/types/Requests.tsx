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
 * Change Password Request to be sent to the server
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Reset Password Request to be sent to the server
 */
export interface ResetPasswordRequest {
    "email": "user@example.com",
    "token": "string",
    "newPassword": "string",
    "confirmNewPassword": "string"
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

export interface PodcastSearchRequest {
  searchTerm: string | string[];
  tags: string[];
  type: string;
  isExplicit: boolean;
  ratingGreaterThan: number;
  releaseDate: string;
}

export interface EpisodeSearchRequest {
  searchTerm: string | string[];
  isExplicit: boolean;
  releaseDate: string;
  minEpisodeLength: number;
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

//#region Episode Bookmark Requests
export interface EpisodeBookmarkRequest {
  title: string;
  note: string;
  time: number;
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

//#region Section Requests
export interface SectionAddRequest {
  title: string;
  start: number;
  end: number;
}

//#endregion

//#region Annotation Requests
export interface AnnotationAddRequest {
  timestamp: number;
  content: string;
  type: string;
  referenceUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

//#endregion

//#region Playlist Requests
export interface PlaylistCreateRequest {
  name: string;
  description: string;
  privacy: string;
  coverArt: File;
  episodeIds: string[];
}

export interface PlaylistEditRequest {
  name: string;
  description: string;
  privacy: string;
  coverArt: File;
}
//#endregion

//#region Episode SaveWatchHistory Request
export interface SaveWatchHistoryRequest {
  listenPosition: number;
}
//#endregion


export interface ChatbotMessageRequest {
  episodeId: string;
  prompt: string ;
}

//#region Episode editTrasncriptLines Request
export interface editTranscriptLinesRequest {
  id: number,
  seek: number,
  start: number,
  end: number,
  text: string,
  speaker: string,
  words: {
    start: number,
    end: number,
    word: string,
    score: number,
    speaker: string
  }[];
}
//#endregion

//#region Payment Request
export interface createPayment {
  episodeId : string,
  points : number
}

export interface confirmPayment{
  pointId:string
}

//# end Region

