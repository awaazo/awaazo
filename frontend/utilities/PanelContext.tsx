import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Chatbot, Episode } from "../types/Interfaces";

interface PanelState {
  isOpen: boolean;
  currentEpisodeId: string | null;
  Chatbot: Chatbot[];
  episode: Episode;
  content: string;
}

interface PanelContextProps {
  state: PanelState;
  dispatch: React.Dispatch<any>;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

const initialState: PanelState = {
  isOpen: false,
  currentEpisodeId: null,
  Chatbot: [] as Chatbot[],
  episode: null,
  content: null,
};

interface PanelProviderProps {
  children: ReactNode;
}

const PanelReducer = (state: PanelState, action: any) => {
  switch (action.type) {
    case "TOGGLE_PANEL":
      return {
        ...state,
        isOpen: !state.isOpen,
        content: action.payload,
      };
    case "SET_EPISODE_ID":
      return {
        ...state,
        currentEpisodeId: action.payload,
      };
    default:
      return state;
  }
};

export const PanelProvider: React.FC<PanelProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(PanelReducer, initialState);

  return (
    <PanelContext.Provider value={{ state, dispatch }}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("Panel must be used within a Panel Provider");
  }
  return context;
};
