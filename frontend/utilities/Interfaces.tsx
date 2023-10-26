export interface Podcast {
  id: string;
  coverArt: string;
  podcasterId: string;
  podcaster: string; // redundant, remove later 
  description: string;
  tags: string[];
  isExplicit: boolean;
  type: "real" | "ai-generated";
  creationDate: Date;
  episodes: Episode[];
  averageRating?: number;
  monthlyListeners: number;
}


export interface Episode {
  id: string;
  podcastId: string;
  podcaster: string;
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
  sections?: {
    startTime: number;
    sectionName: string;
  }[];
  annotations: Annotation[];
  sponsors: Sponsor[];
  transcript?: TranscriptLine[];
};


export interface Annotation {
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
  title: string;
  note?: string;
  time: number;
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
  rating: number;
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
  username: string;
  bio: string;
  interests: string[];
  twitterUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  linkedInUrl?: string;
  dateOfBirth: string;
  gender: string;
}

export interface UserMenuInfo{
  id: string;
  username: string;
  avatarUrl: string;
}
