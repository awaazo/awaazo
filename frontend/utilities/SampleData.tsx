import {Podcast,Episode} from "./Interfaces"

export const podcasts: Podcast[] = [
  {
    id: "podcast1",
    coverArt: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user123",
    podcaster:"Joe Mama",
    tags: ["technology", "AI"],
    description: "A deep dive into the world of artificial intelligence and its implications for the future.",
    isExplicit: false,
    type: "real",
    creationDate: new Date("2023-01-01"),
    episodes: [], // This will be populated later
    averageRating: 4.5,
    totalRatings: 100,
  },
  {
    id: "podcast2",
    coverArt: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user456",
    podcaster:"Joe Mama",
    tags: ["history", "world wars"],
    isExplicit: false,
    description: "A deep dive into the world of artificial intelligence and its implications for the future.",
    type: "ai-generated",
    creationDate: new Date("2023-02-15"),
    episodes: [], // This will be populated later
    averageRating: 4.8,
    totalRatings: 150,
  },
];

export const episodes: Episode[] = [
  {
    id: "episode1",
    podcastId: "podcast1",
    podcaster:"Joe Mama",
    episodeName: "The Future of AI",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 3600, 
    releaseDate: new Date("2023-01-10"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 5000,
    likes: {
      count: 4000,
      isLiked: true,
    },
    comments: {
      count: 100,
      isCommented: false,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "Main Topic",
      },
    ],
    annotations: [],
    sponsors: [],
  },
  {
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },




  

  {
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },{
    id: "episode2",
    podcastId: "podcast2",
    podcaster:"Joe Mama",
    episodeName: "World War II: A Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    duration: 5400, // 1.5 hours
    releaseDate: new Date("2023-02-20"),
    description: "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
    isExplicit: false,
    playCount: 8000,
    likes: {
      count: 6500,
      isLiked: false,
    },
    comments: {
      count: 200,
      isCommented: true,
    },
    bookmarks: [],
    sections: [
      {
        startTime: 60,
        sectionName: "Introduction",
      },
      {
        startTime: 600,
        sectionName: "The Beginning",
      },
      {
        startTime: 3600,
        sectionName: "The End",
      },
    ],
    annotations: [],
    sponsors: [],
  },





];

// Linking episodes to their respective podcasts
podcasts[0].episodes.push(episodes[0]);
podcasts[1].episodes.push(episodes[1]);
