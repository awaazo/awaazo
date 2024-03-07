import { Box, Image, Text, HStack, VStack, Button, useBreakpointValue, Icon } from "@chakra-ui/react";
import { Highlight } from "../../types/Interfaces";
import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";
import { convertTime } from "../../utilities/commonUtils";
import LikeComponent from "../interactionHub/Likes";
import commentButton from "../interactionHub/buttons/CommentButton";

const HighlightCard = ({ highlight }) => {
  const { dispatch } = usePlayer();
  const { id, thumbnailUrl, episodeName, podcastName, duration, likes } = highlight;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleEpisodeClick = () => {
    dispatch({
      type: "PLAY_NOW_QUEUE",
      payload: {
        id,
        thumbnailUrl,
        episodeName,
        podcastName,
        duration,
      },
    });
  };

  return (
    <HStack
      p={2}
      spacing={4}
      alignItems="center"
      borderRadius="26px"
      bg={"rgba(0, 0, 0, 0.2)"}
      boxShadow="md"
      style={{ cursor: "pointer" }}
      onClick={handleEpisodeClick}
    >
      <Image
        boxSize={isMobile ? "0px" : "120px"}
        src={thumbnailUrl}
        borderRadius="10%"
      />
      <VStack spacing={1} alignItems="flex-start">
        <Text fontWeight="bold">{episodeName}</Text>
        <Text fontSize="sm">{podcastName}</Text>
        <HStack>
          <Text fontSize="sm">{convertTime(duration)}</Text>
          <LikeComponent likes={likes} />
          <commentButton />
        </HStack>
      </VStack>
      <Button
        aria-label="Play"
        variant="ghost"
        size="lg"
        colorScheme="brand"
        onClick={handleEpisodeClick}
      >
        <Icon as={FaPlay} />
      </Button>
    </HStack>
  );
}