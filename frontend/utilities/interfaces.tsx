export interface Podcast {
    id: string;
    coverArt: string;
    podcasterId: string;
    podcaster: string; // redundant, remove later 
    description: string;
    tags: string[];
    isExplicit?: boolean;
    type: "real" | "ai-generated";
    creationDate: Date;
    episodes: Episode[];
    averageRating?: number;
    totalRatings?: number;
  }
  
  export interface Episode {
    id: string;
    podcastId: string;
    podcaster: string; // redundant, remove later  
    episodeName: string;
    description: string;
    thumbnail: string;
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
  }
  
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
  