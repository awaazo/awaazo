import { Podcast, Episode, Bookmark, TranscriptLine } from "./Interfaces";

export const podcasts: Podcast[] = [
  {
    id: "podcast1",
    name: "Artificial Intelligence",
    coverArtUrl:
      "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user123",
    podcaster: "Joe Mama",
    description:
      "A deep dive into the world of artificial intelligence and its implications for the future.",
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
    name: "Artificial Intelligence",
    coverArtUrl:
      "https://images.unsplash.com/photo-1515375380578-a0587184cedd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80",
    podcasterId: "user456",
    podcaster: "Joe Mama",
    tags: ["history", "world wars"],
    description:
      "A deep dive into the world of artificial intelligence and its implications for the future.",
    isExplicit: false,
    type: "ai-generated",
    creationDate: new Date("2023-02-15"),
    episodes: [],
    averageRating: 4.8,
    monthlyListeners: 6000,
  },
];

export const bookmarks: Bookmark[] = [
  {
    id: "sfsf",
    title: "This point was interesting",
    timestamp: 2323,
    note: "This was good because...",
  },
  {
    id: "sfsfd",
    title: "Cool point they mentioned",
    timestamp: 2332,
    note: "Lorem ipsum dolor sit amet...",
  },
];

export const sampleTranscripts: TranscriptLine[] = [
  {
    timestamp: 120,
    text: "This is the first line of the transcript.",
    speaker: "Speaker 1",
  },
  {
    timestamp: 240,
    text: "This is the second line of the transcript, which may be less related to the first line.",
    speaker: "Speaker 2",
  },
  {
    timestamp: 360,
    text: "This is the third line of the transcript. It might be a response to the second line or something entirely different.",
    speaker: "Speaker 1",
  },
];

const episodeTemplate: Episode = {
  id: "",
  podcastId: "podcast2",
  podcaster: "Joe Mama",
  episodeName: "World War II: A Deep Dive",
  thumbnailUrl: "https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  duration: 5400, 
  releaseDate: new Date("2023-02-20"),
  description:
    "In this episode, we explore the advancements in AI and what it means for industries and daily life.",
  isExplicit: false,
  playCount: 8000,
  likes: {
    count: 6500,
    isLiked: false,
  },
  comments: [],
  bookmarks: bookmarks,
  sections: [
    { id: "r1", episodeId: 'EP001', timestamp: 0, title: "Sponsors" },
    { id: "2E", episodeId: 'EP001', timestamp: 72, title: "Introduction" },
    { id: "3r", episodeId: 'EP001', timestamp: 200, title: "Part 1: Why bears are cool?" },
    { id: "3er", episodeId: 'EP001', timestamp: 300, title: "Part 2: part 2" },
    { id: "3eer", episodeId: 'EP001', timestamp: 600, title: "Part 3: part 3" },
    { id: "3eerr", episodeId: 'EP001', timestamp: 1000, title: "Part 4: part 4" },
  ],  
  annotations: [],
  sponsors: [],
  transcript: sampleTranscripts,
};

export const episodes: Episode[] = [
  ...Array(10)
    .fill(episodeTemplate)
    .map((ep, idx) => ({ ...ep, id: `episode${idx + 3}` })),
];

episodes.forEach((episode) => {
  const podcast = podcasts.find((p) => p.id === episode.podcastId);
  if (podcast) {
    podcast.episodes.push(episode);
  }
});
