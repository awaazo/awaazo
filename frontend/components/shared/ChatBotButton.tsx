import { Box, Button, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { useChatBot } from "../../utilities/ChatBotContext";

const ChatBot = () => {
  const { dispatch } = useChatBot();

  const handleClick = () => {
    dispatch({ type: "TOGGLE_CHAT" });
  };

  return (
    <>
      <Tooltip label="ChatBot" aria-label="ChatBot">
        <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
          <AiFillMessage size="20px" />
        </Button>
      </Tooltip>
    </>
  );
};

export default ChatBot;
