import React, { useState } from "react";
import { Button, Tooltip } from "@chakra-ui/react";
import { RiRobot2Fill } from "react-icons/ri";
import { useChatBot } from "../../utilities/ChatBotContext";
import AuthPrompt from "../auth/AuthPrompt";
import AuthHelper from "../../helpers/AuthHelper";

const ChatBotButton = ({ episodeId }) => {
  const { dispatch } = useChatBot();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = () => {
    AuthHelper.authMeRequest().then((response) => {
      if (response.status == 401){
        setShowLoginPrompt(true);
        return;
      }else{
        dispatch({ type: "TOGGLE_CHAT" });
        dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
      }
    });
  };

  return (
    <>
      <Tooltip label="ChatBot" aria-label="ChatBot">
        <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
          <RiRobot2Fill size="20px" />
        </Button>
      </Tooltip>
      {showLoginPrompt && (
        <AuthPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="Login to chat and ask about the episode"
        />
      )}
    </>
  );
};

export default ChatBotButton;