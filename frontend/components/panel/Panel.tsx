import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  IconButton,
  VStack,
  Text,
  Input,
  Button,
  Image,
  InputGroup,
  HStack,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { usePanel } from "../../utilities/PanelContext";
import { IoIosCloseCircle } from "react-icons/io";
import ChatBot from "./ChatBot";

const Panel = () => {
  const { state, dispatch } = usePanel();

  console.log(state);
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
            <IconButton
              display="flex"
              aria-label="Close chatbot"
              icon={<IoIosCloseCircle />}
              onClick={togglePanel}
              fontSize="30px"
              variant="ghost"
              color="#FFFFFF6B"
              _hover={{ background: "transparent" }}
              _active={{ background: "transparent" }}
            />
          </Flex>
          <Box>
            {state.content == "ChatBot" && (
              <>
                <ChatBot episodeId={state.currentEpisodeId} />{" "}
              </>
            )}
            {state.content == "Comments" && (
              <>
                <ChatBot episodeId={state.currentEpisodeId} />{" "}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Panel;
