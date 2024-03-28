import React, { useState } from "react";
import { Button, Icon, Tooltip, Box } from "@chakra-ui/react";
import { usePanel } from "../../../utilities/PanelContext";
import { Chat } from '../../../public/icons';

const CommentsButton = ({ episodeId, initialComments, showCount }) => {
  const { dispatch } = usePanel();
  const [noOfComments, setNoOfComments] = useState(initialComments);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch({ type: "OPEN_PANEL", payload: "Comments" });
    dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
  };

  return (
    <>
    <Box zIndex="105">
      {showCount ? (

          <Button leftIcon={<Icon as={Chat} />} onClick={handleClick} variant="minimal" data-cy={`playerbar-comment-button`}>
            {noOfComments}
          </Button>

      ) : (
        <Tooltip label={`${noOfComments} Comments`} aria-label={`${noOfComments} Comments`} >
          <Button  onClick={handleClick} variant={"minimal"} data-cy={`playerbar-comment-button`} color={"az.greyish"} >
            <Chat width="16px" height="16px" />
          </Button>
        </Tooltip>
      )}
      </Box>
    </>
  );
};

export default CommentsButton;
