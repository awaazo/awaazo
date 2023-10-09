// placeholder. will be replaced with interfaces.tsx

export interface Podcast {
    coverArt: string;
    episodeName?: string;
    podcaster?: string;
    isPlaying?: boolean;
    duration: number;
    likes: {
        count: number;
        isLiked: boolean;
    };
    comments: {
        count: number;
        isCommented: boolean;
    };
    isBookmarked?: boolean;
    sections?: {
        startTime: number;
        episodeName: string;
    }[];
}