export interface Podcast {
  id: string;
  name: string;
  description: string;
  coverArtUrl: string;
  podcasterId: string;
  tags: string[];
  isExplicit: boolean;
  type: "real" | "ai-generated";
  episodes: Episode[];
  creationDate: Date;
  averageRating: number;
  totalRaings: number;
  ratings: string[];
}

export interface Episode {
  id: string;
  podcastId: string;
  coverArt: string;
  episodeName: string;
  description: string;
  duration: number;
  releaseDate: Date;
  isExplicit?: boolean;
  playCount?: number;
  likes: {
    count: number;
    isLiked: boolean;
  };
  comments: {
    count: number;
    isCommented: boolean;
  };
  bookmarks?: Bookmark[];
  sections?: Section[];
  annotations: Annotation[];
  sponsors: Sponsor[];
  transcript?: TranscriptLine[];
};

export interface Section {
  id: string;
  episodeId: string;
  title?: string;
  timestamp?: number;
  duration?: number;
}

export interface Comment {
  id: number;
  userId: number;
  episodeId: string;
  text: string;
  dateCreated: Date;
  likes: Like[];
}

export interface Like {
  userId: number;
  commentId?: number;
  episodeId?: string;
}

export interface Annotation {
  id: string;
  timestamp: number;
  content: string;
  type: "link" | "info" | "sponsorship" | "media-link";
  sponsorship?: Sponsor;
  mediaLink?: MediaLink;
}

export interface Sponsor {
  id: string;
  name: string;
  website: string;
}

export interface MediaLink {
  platform: "YouTube" | "Spotify" | "Apple Music";
  url: string;
}

export interface Bookmark {
  id: string;
  title: string;
  note?: string;
  timestamp: number;
}

export interface TranscriptLine {
  timestamp: number; 
  text: string;
  speaker: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  passwordHash: string;
  salt: string;
  avatar: string;
  interests: string[];
  dateOfBirth: Date;
  gender: "male" | "female" | "other" | "prefer not to say";
  isPodcaster: boolean;
  podcasts?: Podcast[];
}

export interface PodcastFollow {
  userId: string;
  podcastId: string;
}

export interface UserFollow {
  followerId: string;
  followingId: string;
}

export interface Subscription {
  userId: string;
  type: "basic" | "premium";
  startDate: Date;
  endDate: Date;
}

export interface PodcastRating {
  id: string;
  userId: string;
  podcastId: string;
  ratings: number[];
  averageRating: number;
  timestamp: Date;
}

export interface PodcastReview {
  id: string;
  userId: string;
  podcastId: string;
  review: string;
  timestamp: Date;
}

export interface UserEpisodeInteraction {
  id: string;
  userId: string;
  episodeId: string;
  hasListened: boolean;
  lastListenedPosition?: number;
  dateListened?: Date;
}

/**
 * User fields related to their profile.
 */
export interface UserProfile {
  id: string;
  avatarUrl: string;
  email: string;
  displayName: string;
  username: string;
  bio: string;
  interests: string[];
  twitterUrl?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  dateOfBirth: string;
  gender: string;
}

export interface UserMenuInfo{
  id: string;
  username: string;
  avatarUrl: string;
}