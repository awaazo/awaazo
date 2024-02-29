import React, { useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { usePanel } from "../../utilities/PanelContext";
import { FaComments } from "react-icons/fa";

const CommentsButton = ({ episodeId, initialComments, showCount }) => {
  const { dispatch } = usePanel();
  const [noOfComments, setNoOfComments] = useState(initialComments);

  const handleClick = () => {
    dispatch({ type: "OPEN_PANEL", payload: "Comments" });
    dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
  };

  return (
    <>
      {showCount ? (
        <Tooltip label="Comment" aria-label="Comment">
          <Button p={2} m={1} leftIcon={<Icon as={FaComments} />} onClick={handleClick} variant={"ghost"} data-cy={`playerbar-comment-button`}>
            {noOfComments}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip label={`${noOfComments} Comments`} aria-label={`${noOfComments} Comments`}>
          <Button p={2} m={1} onClick={handleClick} variant={"ghost"} data-cy={`playerbar-comment-button`}>
            <Icon as={FaComments} />
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default CommentsButton;
