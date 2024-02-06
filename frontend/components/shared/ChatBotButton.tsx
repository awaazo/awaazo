import React, { useState } from "react";
import { Button, Tooltip } from "@chakra-ui/react";
import { RiRobot2Fill } from "react-icons/ri";
import { useChatBot } from "../../utilities/ChatBotContext";
import LoginPrompt from "../auth/LoginPrompt";
import AuthHelper from "../../helpers/AuthHelper";

const ChatBotButton = ({ episodeId }) => {
  const { dispatch } = useChatBot();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = () => {
    AuthHelper.authMeRequest().then((response) => {
      if (response.status == 401){
        //Not logged in, prompt user to sign in.
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
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="To access our ChatBot, you must be logged in. Please log in or create an account."
        />
      )}
    </>
  );
};

export default ChatBotButton;