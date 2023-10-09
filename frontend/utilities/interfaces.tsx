// Podcast Interface
export interface Podcast {
  id: string; // Unique identifier for the podcast
  coverArt: string; // URL to the cover art image of the podcast
  podcasterId: string; // ID of the podcaster/creator
  tags: string[]; // Array of tags/categories associated with the podcast
  isExplicit?: boolean; // Optional flag indicating if the podcast has explicit content
  type: "real" | "ai-generated"; // Type of podcast: either real or AI-generated
  creationDate: Date; // Date when the podcast was created
  episodes: Episode[]; // Array of episodes belonging to this podcast
  averageRating?: number; // Optional computed average of all ratings for this podcast
  totalRatings?: number; // Optional total number of ratings received for this podcast
}

// Episode Interface
export interface Episode {
  id: string; // Unique identifier for the episode
  podcastId: string; // ID of the podcast this episode belongs to
  episodeName: string; // Name of the episode
  thumbnail: string; // URL to the thumbnail image of the episode
  duration: number; // Duration of the episode in seconds
  releaseDate: Date; // Date when the episode was released
  isExplicit?: boolean; // Optional flag indicating if the episode has explicit content
  playCount?: number; // Optional count of times the episode has been played
  likes: {
    count: number; // Number of likes the episode has received
    isLiked: boolean; // Flag indicating if the user has liked the episode
  };
  comments: {
    count: number; // Number of comments the episode has received
    isCommented: boolean; // Flag indicating if the user has commented on the episode
  };
  bookmarks?: Bookmark[]; // Optional array of bookmarks added to the episode by the user
  sections?: {
    startTime: number; // Start time of the section within the episode
    sectionName: string; // Name of the section
  }[];
  annotations: Annotation[]; // Updated to include the extended Annotation interface
  sponsors: Sponsor[]; // Array of sponsors for this episode
}

// Annotation Interface
export interface Annotation {
  timestamp: number; // Timestamp of the annotation within the episode
  content: string; // Content of the annotation
  type: "link" | "info" | "sponsorship" | "media-link";
  sponsorship?: Sponsor; // Optional sponsorship details, present if type is 'sponsorship'
  mediaLink?: MediaLink; // Optional media lin details, present if type is 'media-link'
}

// Sponsor Interface
export interface Sponsor {
    id: string; // Unique identifier for the sponsor
    name: string; // Name of the sponsor
    website: string; // URL to the sponsor's website
  }
  
  // Media Link Interface
  export interface MediaLink {
    platform: "YouTube" | "Spotify" | "Apple Music"; // Platform where the media is hosted
    url: string; // URL to the media
  }

// Bookmark Interface
export interface Bookmark {
  title: string; // Title of the bookmark
  note?: string; // Optional note associated with the bookmark
  time: number; // Time of the bookmark within the episode
}

// User Interface
export interface User {
  id: string; // Unique identifier for the user
  username: string; // Username of the user
  email: string; // Email address of the user
  passwordHash: string; // Hashed password of the user
  salt: string; // Salt used for hashing the password
  avatar: string; // URL to the user's avatar image
  interests: string[]; // Array of interests of the user
  dateOfBirth: Date; // Date of birth of the user
  gender: "male" | "female" | "other" | "prefer not to say"; // Gender of the user
  isPodcaster: boolean; // Flag indicating if the user is a podcaster
  podcasts?: Podcast[]; // Optional array of podcasts created by the user
}

// Podcast Follow Interface
export interface PodcastFollow {
  userId: string; // ID of the user following the podcast
  podcastId: string; // ID of the podcast being followed
}

// User Follow Interface
export interface UserFollow {
  followerId: string; // ID of the user following another user
  followingId: string; // ID of the user being followed
}

// Subscription Interface
export interface Subscription {
  userId: string; // ID of the subscribed user
  type: "basic" | "premium"; // Type of subscription: either basic or premium
  startDate: Date; // Start date of the subscription
  endDate: Date; // End date of the subscription
}

// Podcast Rating Interface
export interface PodcastRating {
  id: string; // Unique identifier for each rating entry
  userId: string; // ID of the user who provided the rating
  podcastId: string; // ID of the podcast being rated
  rating: number; // The rating value, e.g., from 1 to 5
  timestamp: Date; // When the rating was provided
}


