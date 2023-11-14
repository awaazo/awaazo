import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";

import { Episode } from "./Interfaces";

interface PlayerState {
  episode: null | Episode;
  currentTime: number;
}

interface PlayerContextProps {
  state: PlayerState;
  dispatch: React.Dispatch<any>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const initialState: PlayerState = {
  episode: null,
  currentTime: 0,
};

const playerReducer = (state: PlayerState, action: any) => {
  switch (action.type) {
    case "SET_EPISODE":
      return {
        ...state,
        episode: action.payload,
      };
    case "SET_CT":
      return {
        ...state,
        currentTime: action.payload,
      };
    default:
      return state;
  }
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio() : null,
  );

  useEffect(() => {
    const storedEpisode = localStorage.getItem("storedEpisode");
    const storedPosition = sessionStorage.getItem("playbackPosition");

    if (storedEpisode) {
      const parsedEpisode = JSON.parse(storedEpisode);
      dispatch({ type: "SET_EPISODE", payload: parsedEpisode });
    }
    if (storedPosition) {
      const parsedPosition = JSON.parse(storedPosition);
      console.log("Parsed pos:" + parsedPosition);
      audioRef.current.currentTime = parsedPosition;
    }
  }, []);

  useEffect(() => {
    if (state.currentTime > 5) storeTimeInLocalStorage(state.currentTime);
  }, [state.currentTime]);

  useEffect(() => {
    storeEpisodeInLocalStorage(state.episode);

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

const storeEpisodeInLocalStorage = (episode: Episode): void => {
  localStorage.setItem("storedEpisode", JSON.stringify(episode));
};

const storeTimeInLocalStorage = (position): void => {
  localStorage.setItem("playbackPosition", JSON.stringify(position));
};
