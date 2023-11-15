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
}

interface PlayerContextProps {
  state: PlayerState;
  dispatch: React.Dispatch<any>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const initialState: PlayerState = {
  episode: null,
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
