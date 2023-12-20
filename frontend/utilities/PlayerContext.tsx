import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Episode } from "./Interfaces";

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
        episode: action.payload,
        currentEpisodeIndex: 0,
        playlist: [action.payload],
      };
    case "ADD_PLAYLIST_NEXT":
      return {
        ...state,
        playlist: [
          ...state.playlist.slice(0, state.currentEpisodeIndex + 1),
          ...action.payload,
          ...state.playlist.slice(state.currentEpisodeIndex + 1),
        ],
      };
    case "ADD_PLAYLIST_LATER":
      return {
        ...state,
        playlist: [...state.playlist, ...action.payload],
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
    case "GET_QUEUE":
      return {
        ...state,
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
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
