import React from "react";
import { Button, Tooltip } from "@chakra-ui/react";
import { RiRobot2Fill } from "react-icons/ri";

import { useChatBot } from "../../utilities/ChatBotContext";

const ChatBotButton = ({ episodeId }) => {
  const { dispatch } = useChatBot();

  const handleClick = () => {
    dispatch({ type: "TOGGLE_CHAT" });
    dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
  };

  return (
    <>
      <Tooltip label="ChatBot" aria-label="ChatBot">
        <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
          <RiRobot2Fill size="20px" />
        </Button>
      </Tooltip>
    </>
  );
};

export default ChatBotButton;