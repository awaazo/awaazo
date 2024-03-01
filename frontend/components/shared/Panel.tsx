import React from "react";
import { Box, IconButton, Text, Flex } from "@chakra-ui/react";
import { usePanel } from "../../utilities/PanelContext";
import { IoIosCloseCircle } from "react-icons/io";
import ChatBot from "../social/ChatBot";
import Comments from "../social/Comments";
import Bookmarks from "../social/Bookmarks";


const Panel = () => {
  const { state, dispatch } = usePanel();

  const togglePanel = () => {
    dispatch({ type: "TOGGLE_PANEL", payload: null });
  };

  return (
    <Box
      position="fixed"
      right="0"
      top="5em"
      transition="width 0.2s ease-in-out"
      w={state.isOpen ? "32%" : "0"}
      h="calc(88vh - 5em)"
      overflow="hidden"
      p={state.isOpen ? "20px" : "0"}
      zIndex="1000"
      bg="rgba(255, 255, 255, 0.04)"
      backdropFilter="blur(50px)"
      outline={"2px solid rgba(255, 255, 255, 0.06)"}
      roundedTopLeft="10px"
      roundedBottomLeft="10px"
    >
      {state.isOpen && (
        <Box>
          <Flex>
            <IconButton display="flex" aria-label="Close chatbot" icon={<IoIosCloseCircle />} onClick={togglePanel} fontSize="30px" variant="ghost" color="#FFFFFF6B" _hover={{ background: "transparent" }} _active={{ background: "transparent" }} />
            <Text fontSize={"24px"} fontWeight={"bold"} ml={"10px"} mt={"2px"}>
              {state.content}
            </Text>
          </Flex>
          <Box>
            {state.content === "ChatBot" && state.currentEpisodeId && (
              <ChatBot episodeId={state.currentEpisodeId} />
            )}
            {state.content === "Comments" && state.currentEpisodeId && (
              <Comments episodeIdOrCommentId={state.currentEpisodeId} initialComments={0} />
            )}
             {state.content === "Bookmarks" && state.currentEpisodeId && (
              <Bookmarks episodeId={state.currentEpisodeId} selectedTimestamp={null} />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Panel;
