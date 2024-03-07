import { Box, Image, Text, IconButton, VStack, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { Highlight } from "../../types/Interfaces";
import { FaPlay, FaPause, FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import LikeComponent from "../interactionHub/Likes";
import CommentButton from "../interactionHub/buttons/CommentButton";

const HighlightCard = ({ highlight }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Adjusted to use properties from the Highlight interface
  const { id, thumbnailUrl, episodeName, highlightName, duration, likes, comments } = highlight;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Toggle play/pause for the highlight. Actual implementation will depend on player integration.
  };

  // Mocking interaction as there's no backend yet
  const handleLike = () => {
    // Placeholder for like interaction
  };

  const handleComment = () => {
    // Placeholder for comment interaction
  };

  const handleShare = () => {
    // Placeholder for share interaction
  };

  return (
    <Box
      position="relative"
      height="100vh" // Full-screen view for each highlight
      width="full"
    >
      <Image
        src={thumbnailUrl}
        alt={`Highlight from ${episodeName}: ${highlightName}`}
        fit="cover"
        w="full"
        h="full"
        position="absolute"
        zIndex="-1"
        opacity="0.5"
      />
      <VStack
        justifyContent="center"
        alignItems="center"
        height="full"
        spacing={4}
        p={4}
        position="relative"
      >
        <Text fontSize="2xl" fontWeight="bold" color="white">{highlightName}</Text>
        <Text fontSize="lg" color="whiteAlpha.800">{episodeName}</Text>
        <IconButton
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          aria-label={isPlaying ? "Pause highlight" : "Play highlight"}
          colorScheme="teal"
          variant="solid"
          isRound
          size="lg"
          onClick={togglePlay}
          zIndex="1"
        />
        <VStack>
          <IconButton icon={<FaHeart />} aria-label="Like" colorScheme="red" variant="ghost" onClick={handleLike} />
          <Text fontSize="sm" color="white">{`${likes.count} Likes`}</Text>
          <IconButton icon={<FaCommentDots />} aria-label="Comment" colorScheme="blue" variant="ghost" onClick={handleComment} />
          <Text fontSize="sm" color="white">{`${comments} Comments`}</Text>
          <IconButton icon={<FaShare />} aria-label="Share" colorScheme="green" variant="ghost" onClick={handleShare} />
        </VStack>
      </VStack>
    </Box>
  );
};

export default HighlightCard;
