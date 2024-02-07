import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Chatbot } from "../types/Interfaces";

interface ChatBotState {
  isOpen: boolean;
  currentEpisodeId: string | null;
  Chatbot: Chatbot[]
}

interface ChatBotContextProps {
  state: ChatBotState;
  dispatch: React.Dispatch<any>;
}

const ChatBotContext = createContext<ChatBotContextProps | undefined>(
  undefined,
);

const initialState: ChatBotState = {
  isOpen: false,
  currentEpisodeId: null,
  Chatbot: [] as Chatbot[],  
};

interface ChatBotProviderProps {
  children: ReactNode;
}

const chatBotReducer = (state: ChatBotState, action: any) => {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return {
        ...state,
        isOpen: !state.isOpen,
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

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatBotReducer, initialState);

  return (
    <ChatBotContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBot must be used within a ChatBotProvider");
  }
  return context;
};
