import { Podcast, Episode } from "./Interfaces";

export const podcasts: Podcast[] = [
  {
    id: "podcast1",
    coverArt: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user123",
    podcaster: "Joe Mama",
    description: "A deep dive into the world of artificial intelligence and its implications for the future.",
    tags: ["technology", "AI"],
    isExplicit: false,
    type: "real",
    creationDate: new Date("2023-01-01"),
    episodes: [],
    averageRating: 4.5,
    monthlyListeners: 5000,
  },
  {
    id: "podcast2",
    coverArt: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user456",
    podcaster: "Joe Mama",
    tags: ["history", "world wars"],
    description: "A deep dive into the world of artificial intelligence and its implications for the future.",
    isExplicit: false,
    type: "ai-generated",
    creationDate: new Date("2023-02-15"),
    episodes: [],
    averageRating: 4.8,
    monthlyListeners: 6000,
  },
];

const episodeTemplate: Episode = {
  id: "",
  podcastId: "podcast2",
  podcaster: "Joe Mama",
  episodeName: "World War II: A Deep Dive",
  thumbnail: "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
  duration: 5400, 
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
  listeners: {
    count: 7500,
    hasListened: true,
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
  transcript:[],
};

export const episodes: Episode[] = [
  ...Array(10).fill(episodeTemplate).map((ep, idx) => ({ ...ep, id: `episode${idx + 3}` }))
];

episodes.forEach(episode => {
  const podcast = podcasts.find(p => p.id === episode.podcastId);
  if (podcast) {
    podcast.episodes.push(episode);
  }
});
