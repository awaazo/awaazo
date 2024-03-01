import React, { useState } from "react";
import { Button,  Tooltip } from "@chakra-ui/react";
import { usePanel } from "../../../utilities/PanelContext";
import { MdBookmark } from "react-icons/md";
import AuthPrompt from "../../auth/AuthPrompt";
import AuthHelper from "../../../helpers/AuthHelper";

const BookmarksButtton = ({ episodeId, selectedTimestamp}) => {
    const { dispatch } = usePanel();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
    const handleClick = async () => {
      try {
        const response = await AuthHelper.authMeRequest();
        if (response.status == 401) {
          setShowLoginPrompt(true);
          return;
        } else {
          dispatch({ type: "OPEN_PANEL", payload: "Bookmarks" });
          dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
          dispatch({ type: "SET_SELECTED_TIMESTAMP", payload: selectedTimestamp });
        }
      } catch (error) {
        console.error("Error handling click:", error);
      }
    };
  
    return (
      <>
        <Tooltip label="Bookmarks" aria-label="Bookmarks">
          <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
            <MdBookmark size="20px" />
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
export default BookmarksButtton;
