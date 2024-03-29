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
  Transcript,
  Annotation,
  WatchHistory,
  Metrics,
  Chatbot,
  Reply,
  Transaction,
  Balance,
  Email,
  Highlight,
} from './Interfaces'

export interface BaseResponse {
  [x: string]: any
  status: number
  message: string
}

//#region Auth Responses

export interface LoginResponse extends BaseResponse {
  data: string
}

export interface RegisterResponse extends BaseResponse {
  data: string
}

export interface GoogleSSOResponse extends BaseResponse {
  data: string
}

export interface LogoutResponse extends BaseResponse {}

export interface MeResponse extends BaseResponse {
  userMenuInfo: UserMenuInfo
}

export interface SearchProfilesResponse extends BaseResponse {
  users: User[]
}

//#endregion

//#region User Profile Responses

export interface UserProfileResponse extends BaseResponse {
  userProfile: UserProfile
}

export interface UserProfileByIdResponse extends BaseResponse {
  userProfileByID: userProfileByID
}

//#endregion

//#region Podcast Responses
export interface CreatePodcastResponse extends BaseResponse {
  data: string
}

export interface EditPodcastResponse extends BaseResponse {
  data: string
}

export interface MyPodcastResponse extends BaseResponse {
  myPodcasts: Podcast[]
}

export interface AllPodcastResponse extends BaseResponse {
  podcasts: Podcast[]
}

export interface AllEpisodeResponse extends BaseResponse {
  episode: Episode[]
}

export interface ByTagsPodcastResponse extends BaseResponse {
  podcasts: Podcast[]
}

export interface SearchPodcastResponse extends BaseResponse {
  podcasts: Podcast[]
}

export interface GetMyPodcastResponse extends BaseResponse {
  podcast: Podcast
}

export interface SearchEpisodeResponse extends BaseResponse {
  episodes: Episode[]
}

export interface GetChangePasswordResponse extends BaseResponse {
  data: string
}

export interface GetResetPasswordResponse extends BaseResponse {
  data: string
}

//#endregion

//#region Podcast Responses
export interface CreateEpisodeResponse extends BaseResponse {
  data: string
}

export interface EditEpisodeResponse extends BaseResponse {
  data: string
}

export interface EpisodeAddAudioResponse extends BaseResponse {
  data: string
}

export interface GetMyEpisodeResponse extends BaseResponse {
  episode: Episode
}

//#endregion

export interface NotificationResponse extends BaseResponse {
  notifications: Notification[]
}

//#region Social Responses
export interface GetCommentsResponse extends BaseResponse {
  comments: Comment[]
}
export interface GetRepliesResponse extends BaseResponse {
  replies: Reply[]
}
export interface IsLikedResponse extends BaseResponse {
  isLiked: boolean
}

//#endregion

//#region Episode Bookmark Responses
export interface GetBookmarksResponse extends BaseResponse {
  bookmarks: Bookmark[]
}

//#endregion

//#region Social Responses
export interface AddSectionResponse extends BaseResponse {
  data: string
}

export interface getSectionResponse extends BaseResponse {
  sections: Section[]
}

//#endregion

//#region Highlight Responses

export interface AddHighlightResponse extends BaseResponse {
  data: string
}

export interface GetHighlightResponse extends BaseResponse {
  highlights: Highlight[]
}

//#region Annotation Responses
export interface AddAnnotationResponse extends BaseResponse {
  data: string
}

export interface getAnnotationResponse extends BaseResponse {
  annotations: Annotation[]
}
//#endregion

//#region Playlist Responses
export interface PlaylistDataResponse extends BaseResponse {
  data: string
}

export interface GetPlaylistsResponse extends BaseResponse {
  playlists: Playlist[]
}

export interface GetPlaylistEpisodesResponse extends BaseResponse {
  playlist: Playlist
}

//#endregion

//#region Transcript Response
export interface GetTranscriptResponse extends BaseResponse {
  transcript: Transcript
}

//#endregion

//#region Transcript Response
export interface GetTranscriptTextResponse extends BaseResponse {
  text: string
}

//#region Watch History Response
export interface GetWatchHistoryResponse extends BaseResponse {
  watchHistory: WatchHistory
}

//#endregion

//#region Metrics Responses
export interface GetMetricsResponse extends BaseResponse {
  metrics: Metrics
}

//#endregion

//#region Admin Responses
export interface GetUsersResponse extends BaseResponse {
  users: User[]
}

export interface GetEmailLogs extends BaseResponse {
  emails: Email[]
}

export interface GetReports extends BaseResponse {
  reports: Report[]
}

//#endregion

export interface GetChatbotResponse extends BaseResponse {
  episodeId: string
  userId: string
  messages: Chatbot[]
}

export interface createPaymentResponse extends BaseResponse {
  data: string
}

export interface confirmPaymentResponse extends BaseResponse {
  data: string
}

export interface getUserBalance extends BaseResponse {
  data: number
}
export interface WithdrawResponse extends BaseResponse {
  data: string
}

export interface TransactionResponse extends BaseResponse {
  data: Transaction[]
}

export interface Last5DaysBalanceResponse extends BaseResponse {
  data: Balance[]
}
