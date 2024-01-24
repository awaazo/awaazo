import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Episode } from "./Interfaces";

interface ChatBotState {
  episode: Episode;
  isOpen: boolean;
}

interface ChatBotContextProps {
  state: ChatBotState;
  dispatch: React.Dispatch<any>;
}

const ChatBotContext = createContext<ChatBotContextProps | undefined>(
  undefined,
);

const initialState: ChatBotState = {
  episode: null,
  isOpen: false,
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
        episode: action.payload,
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
