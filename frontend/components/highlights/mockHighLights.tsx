const mockHighlights = [
    {
      id: "1",
      podcastId: "podcast1",
      podcastName: "Tech Today",
      episodeId: "episode1",
      episodeName: "The Future of AI",
      thumbnailUrl: "path/to/thumbnail1.jpg",
      highlightName: "Breaking Down AI",
      description: "A deep dive into how AI is changing the tech landscape.",
      duration: 15,
      releaseDate: new Date("2023-04-01"),
      isExplicit: false,
      playCount: 150,
      likes: {
        count: 120,
        isLiked: false,
      },
      comments: 35,
      bookmarks: 20,
      totalPoints: 100,
      annotations: [],
      sponsors: [],
      transcript: [],
      src: "path/to/highlight1.mp3"
    },
    {
      id: "2",
      podcastId: "podcast2",
      podcastName: "Health Hacks",
      episodeId: "episode2",
      episodeName: "Nutrition Myths",
      thumbnailUrl: "path/to/thumbnail2.jpg",
      highlightName: "Debunking Diet Myths",
      description: "Experts discuss common misconceptions about dieting.",
      duration: 15,
      releaseDate: new Date("2023-04-15"),
      isExplicit: false,
      playCount: 200,
      likes: {
        count: 95,
        isLiked: false,
      },
      comments: 40,
      bookmarks: 25,
      totalPoints: 120,
      annotations: [],
      sponsors: [],
      transcript: [],
      src: "path/to/highlight2.mp3"
    },
    // Add more mock highlights as needed
  ];
  
  export default mockHighlights;