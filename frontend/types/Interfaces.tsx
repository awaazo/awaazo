export interface Podcast {
  id: string
  coverArtUrl: string
  name: string
  podcasterId: string
  podcaster: string
  description: string
  tags: string[]
  isExplicit: boolean
  type: 'real' | 'ai-generated'
  creationDate: Date
  episodes: Episode[]
  averageRating?: number
  monthlyListeners: number
  totalPodcastPoints: number
  highlights: Highlight[]
}

export interface Episode {
  id: string
  podcastId: string
  podcastName: string
  thumbnailUrl: string
  episodeName: string
  description: string
  duration: number
  releaseDate: Date
  isExplicit?: boolean
  playCount?: number
  isTranscriptionReady: boolean
  transcriptionStatus: string
  likes: {
    count: number
    isLiked: boolean
  }
  bookmarks?: Bookmark[]
  sections?: Section[]
  annotations: Annotation[]
  sponsors: Sponsor[]
  transcript?: Transcript[]
  totalPoints: number
  highlights: Highlight[]
}

export interface Highlight {
  highlightId: string
  id: string
  podcastId: string
  podcastName: string
  episodeId: string
  episodeName: string
  thumbnailUrl: string
  highlightName: string
  description: string
  duration: number
  releaseDate: Date
  isExplicit: boolean
  playCount: number
  likes: {
    count: number
    isLiked: boolean
  }
  comments: number
  bookmarks: number
  totalPoints: number
  annotations: Annotation[]
  sponsors: Sponsor[]
  transcript?: Transcript[]
  Title: string
  Description: string
}

export interface Playlist {
  id: string
  name: string
  user: User
  description: string
  privacy: string
  isHandledByUser: boolean
  numberOfEpisodes: number
  duration: number
  createdAt: Date
  updatedAt: Date
  playlistEpisodes: Episode[]
  coverArt: string
  lastUpdated: string
}

export interface Section {
  id: string
  episodeId: string
  title: string
  start: number
  end: number
}

export interface Comment {
  id: string
  user: User
  episodeId: string
  text: string
  dateCreated: Date
  likes: number
  noOfReplies: number
}

export interface Like {
  userId: number
  commentId?: number
  episodeId?: string
}

export interface Reply {
  id: number
  user: User
  text: string
  dateCreated: Date
  likes: Like[]
}

export interface Annotation {
  id: string
  timestamp: number
  content: string
  type: 'link' | 'info' | 'sponsorship' | 'media-link'
  sponsorship?: Sponsor
  mediaLink?: MediaLink
}

export interface Sponsor {
  id: string
  name: string
  website: string
}

export interface MediaLink {
  platform: 'YouTube' | 'Spotify' | 'Apple Music'
  url: string
}

export interface Bookmark {
  id: string
  title: string
  note?: string
  time: number
}

export interface WatchHistory {
  listenPosition: number
}

export interface Transcript {
  id: number
  seek: number
  start: number
  end: number
  text: string
  speaker: string
  words: {
    start: number
    end: number
    word: string
    score: number
    speaker: string
  }[]
}

export interface Metrics {
  totalEpisodesLikes: number
  mostLikedEpisode: string
  totalTimeWatched: number
  totalPlayCount: number
  mostPlayedEpisode: string
  totalCommentsCount: number
  mostCommentedOnEpisode: string
  mostLikedComment: string
}

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  passwordHash: string
  salt: string
  avatarUrl: string
  interests: string[]
  dateOfBirth: Date
  gender: 'male' | 'female' | 'other' | 'prefer not to say'
  isPodcaster: boolean
  podcasts?: Podcast[]
  isAdmin: boolean
  deletedAt: Date
  deletedBy: string
}

export interface PodcastFollow {
  userId: string
  podcastId: string
}

export interface UserFollow {
  followerId: string
  followingId: string
}

export interface Subscription {
  userId: string
  type: 'basic' | 'premium'
  startDate: Date
  endDate: Date
}

export interface PodcastRating {
  id: string
  userId: string
  podcastId: string
  rating: number
  timestamp: Date
}

export interface UserEpisodeInteraction {
  id: string
  userId: string
  episodeId: string
  hasListened: boolean
  lastListenedPosition?: number
  dateListened?: Date
}

export interface UserWatchHistory {
  page: number
  pageSize: number
}

/**
 * User fields related to their profile.
 */
export interface UserProfile {
  id: string
  avatarUrl: string
  email: string
  displayName: string
  username: string
  bio: string
  interests: string[]
  twitterUrl?: string
  githubUrl?: string
  linkedInUrl?: string
  websiteUrl?: string
  dateOfBirth: string
  gender: string
}

export interface userProfileByID {
  podcasts: Podcast[]
  email: string
  displayName: string
  bio: string
  interests: string[]
  twitterUrl?: string
  githubUrl?: string
  linkedInUrl?: string
  websiteUrl?: string
  dateOfBirth: string
  gender: string
  id: string
  avatarUrl: string
  username: string
}

export interface UserMenuInfo {
  id: string
  username: string
  avatarUrl: string
  isAdmin: boolean
}

/**
 * User fields related to their Notifications.
 * */

export interface Notification {
  id: string
  title: string
  message: string
  link: string
  isRead: boolean
  media: string
  type: string
  createdAt: Date
}

export interface MySubscriptions {
  id: string
  name: string
  description: string
  coverArtUrl: string
  podcasterId: string
  tags: string[]
  isExplicit: boolean
  type: 'real' | 'ai-generated'
  episodes: Episode[]
  averageRating?: number
  totalRatings?: number
  ratings?: PodcastRating[]
}

export interface ChatbotMessage {
  id: string
  userId: string
  episodeId: string
  message: string
  isPrompt: boolean
  username: string
  avatarUrl: string
  sentAt: Date
}

export interface Chatbot {
  episodeId: string
  userId: string
  messages: ChatbotMessage[]
}

export interface Transcript {
  episodeId: string
  status: string
  lines: TranscriptLine[]
}

export interface TranscriptLine {
  id: number
  seek: number
  start: number
  end: number
  text: string
  speaker: string
  words: TranscriptWord[]
}

export interface TranscriptWord {
  start: number
  end: number
  word: string
  score: number
  speaker: string
}

export interface Transaction {
  amount: number
  username: string
  date: Date
  userId: string
  senderId: string
  senderName: string
  type: string
}

export interface Balance {
  amount: number
  date: string
}

export interface Email {
  delivered: boolean
  adminUserId: string
  toUserId: string
  subject: string
  body: string
  createdAt: Date
}

export interface Report {
  id: string
  targetEntityName: string
  targetId: string
  reportedBy: string
  reason: string
  status: number
  deletedAt: Date
  deletedBy: string
  amount: number
  date: string
}

export interface Metrics {
  totalClicks: number
  averageClicks: number
  totalWatchTime: string
  averageWatchTime: string
  totalComments: number
  commentsPercentage: number
  totalLikes: number
  likesPercentage: number
  totalListeners: number
}

export interface EpisodeWatchHistory {
  episodeId: string
  hasListened: boolean
  hasLiked: boolean
  clicks: number
  totalListenTime: string
  lastListenPosition: number
  dateListened: Date
}
