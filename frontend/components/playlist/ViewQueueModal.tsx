import React from "react";
import { Box, Flex, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { usePlayer } from "../../utilities/PlayerContext";
import { FaDeleteLeft } from "react-icons/fa6";

const ViewQueueModal = ({ isOpen, onClose }) => {
  const { state, dispatch } = usePlayer();

  const handleQueueSelect = (index: number) => {
    dispatch({
      type: "SET_CURRENT_INDEX",
      payload: index,
    });
  };

  const handleRemoveFromQueue = (episode) => {
    dispatch({ type: "REMOVE_FROM_QUEUE", payload: episode });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Queue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {state.playlist && state.playlist.length > 0 ? (
              state.playlist.map((episode, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  mb={2}
                  bg={index === state.currentEpisodeIndex ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)"}
                  p={3}
                  borderRadius={"50px"}
                  onClick={() => handleQueueSelect(index)}
                  _hover={{ cursor: "pointer" }}
                  justifyContent="space-between" // Add this line
                >
                  <Box w="40px" h="40px" borderRadius="50%" overflow="hidden" marginRight="10px">
                    <Image as="img" src={episode.thumbnailUrl} alt={episode.episodeName} w="100%" h="100%" />
                  </Box>
                  <Text fontWeight={state.currentEpisodeIndex === index ? "bold" : "normal"}>{state.currentEpisodeIndex === index ? `${episode.episodeName} - Now Playing` : episode.episodeName}</Text>

                  <Tooltip label="Remove from Queue">
                    <IconButton
                      variant="ghost"
                      icon={<FaDeleteLeft />}
                      aria-label="Remove from Queue"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromQueue(episode);
                      }}
                    />
                  </Tooltip>
                </Flex>
              ))
            ) : (
              <Text textAlign="center" mt={5} fontWeight="bold">
                You have no episodes in your queue.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewQueueModal;
