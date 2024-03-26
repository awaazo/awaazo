import React, { useState } from "react";
import { Button, Tooltip } from "@chakra-ui/react";
import { Waazo } from '../../../public/icons';
import { usePanel } from "../../../utilities/PanelContext";
import AuthPrompt from "../../auth/AuthPrompt";
import AuthHelper from "../../../helpers/AuthHelper";

const ChatBotButton = ({ episodeId }) => {
  const { dispatch } = usePanel();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = () => {
    AuthHelper.authMeRequest().then((response) => {
      if (response.status == 401) {
        setShowLoginPrompt(true);
        return;
      } else {
        dispatch({ type: "OPEN_PANEL", payload: "ChatBot" });
        dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
      }
    });
  };

  return (
    <>
      <Tooltip label="ChatBot" aria-label="ChatBot">
        <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
          <Waazo width="18px" height="18px" />
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
