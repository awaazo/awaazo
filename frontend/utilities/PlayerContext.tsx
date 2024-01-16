import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Episode } from "./Interfaces";
import PodcastHelper from "../helpers/PodcastHelper";
import { WatchHistory } from "../utilities/Interfaces";
import { convertTime } from "../utilities/commonUtils"; 
import { SaveWatchHistoryRequest } from "../utilities/Requests";

interface PlayerState {
  episode: Episode;
  currentEpisodeIndex: number | null;
  playlist: Episode[] | null;
}

interface PlayerContextProps {
  state: PlayerState;
  dispatch: React.Dispatch<any>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const initialState: PlayerState = {
  episode: null,
  currentEpisodeIndex: null,
  playlist: [],
};

interface PlayerProviderProps {
  children: ReactNode;
}

// Function to shuffle an array using Durstenfeld shuffle
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const playerReducer = (state: PlayerState, action: any) => {
  switch (action.type) {
    case "PLAY_NOW_QUEUE":
      return {
        ...state,
        episode: action.payload,
        currentEpisodeIndex: 0,
        playlist: [action.payload],
      };
    case "ADD_NEXT_QUEUE":
      return {
        ...state,
        playlist: [
          ...state.playlist.slice(0, state.currentEpisodeIndex + 1),
          action.payload,
          ...state.playlist.slice(state.currentEpisodeIndex + 1),
        ],
      };
    case "ADD_LATER_QUEUE":
      return {
        ...state,
        playlist: [...state.playlist, action.payload],
      };
    case "PLAY_PLAYLIST_NOW":
      return {
        ...state,
        currentEpisodeIndex: 0,
        playlist: action.payload.playlistEpisodes,
        episode: action.payload.playlistEpisodes[0],
      };
    case "SHUFFLE_PLAYLIST_NOW":
      const shuffledPlaylist = shuffleArray(action.payload.playlistEpisodes);
      return {
        ...state,
        currentEpisodeIndex: 0,
        playlist: shuffledPlaylist,
        episode: shuffledPlaylist[0],
      };

    case "ADD_PLAYLIST_NEXT":
      const newPlaylist = action.payload.playlistEpisodes;
      return {
        ...state,
        playlist: [
          ...state.playlist.slice(0, state.currentEpisodeIndex + 1),
          ...action.payload.playlistEpisodes,
          ...state.playlist.slice(state.currentEpisodeIndex + 1),
        ],
      };
    case "ADD_PLAYLIST_LATER":
      return {
        ...state,
        playlist: [...state.playlist, ...action.payload.playlistEpisodes],
      };
    case "PLAY_NEXT":
      const nextIndex = state.currentEpisodeIndex + 1;
      const nextEpisode = state.playlist[nextIndex];
      return {
        ...state,
        episode: nextEpisode !== undefined ? nextEpisode : state.episode,
        currentEpisodeIndex:
          nextEpisode !== undefined ? nextIndex : state.currentEpisodeIndex,
      };
    case "PLAY_PREVIOUS":
      const prevIndex = state.currentEpisodeIndex - 1;
      const prevEpisode = state.playlist[prevIndex];
      return {
        ...state,
        episode: prevEpisode !== undefined ? prevEpisode : state.episode,
        currentEpisodeIndex:
          prevEpisode !== undefined ? prevIndex : state.currentEpisodeIndex,
      };
    case "SET_CURRENT_INDEX":
      const newEpisode = state.playlist[action.payload];
      return {
        ...state,
        episode: newEpisode,
        currentEpisodeIndex: action.payload,
      };

    default:
      return state;
  }
};

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio() : null,
  );

  const request: SaveWatchHistoryRequest = {
    timestamp: audioRef.current.currentTime, // Set the current timestamp for the playerbar
  };

  const handleBeforeUnload = async () => {
    if (audioRef.current) {
      await PodcastHelper.saveWatchHistory(state.episode.id, request)
      .then((response) => {
        if (response.status === 200) {
          console.log("Saved Episode Watch History");
        } else {
          console.error("Error saving the episode watch history:", response.message);
        }
      });
    }
  };

  useEffect(() => {
    const loadWatchHistory = async () => {
      if (audioRef.current && state.episode.id) {
        PodcastHelper.getWatchHistory(state.episode.id)
        .then((res) => {
          if (res.status === 200) {
            audioRef.current.currentTime = res.watchHistory.timestamp;
          } else {
            console.error("Error fetching section data:", res.message);
          }
        })
        .catch((error) => console.error("Error fetching section data:", error));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Call the function to load the watch history
    loadWatchHistory();
  
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.episode]);


  return (
    <PlayerContext.Provider value={{ state, dispatch, audioRef }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
