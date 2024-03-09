import React from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { PlayIcon, PauseIcon, ChevronDownIcon, ChatIcon, HeartIcon, ShareIcon } from "@chakra-ui/icons";

const PodcastHighlight = ({ highlight }) => {
  const handlePlayPause = () => {
    // Add logic to play or pause the highlight
  };

  const handleNextHighlight = () => {
    // Add logic to scroll to the next relevant podcast highlight
  };

  const handleNavigateToFullEpisode = () => {
    // Add logic to navigate to the full podcast episode
  };

  const handleLike = () => {
    // Add logic to handle liking the highlight
  };

  const handleComment = () => {
    // Add logic to handle commenting on the highlight
  };

  const handleShare = () => {
    // Add logic to handle sharing the highlight
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
      {/* Podcast Highlight */}
      <Box position="relative" onClick={handleNavigateToFullEpisode}>
        <Box /* Add styles for the highlight video */></Box>
        <IconButton
                  icon={highlight.isPlaying ? <PauseIcon /> : <PlayIcon />}
                  onClick={handlePlayPause}
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)" aria-label={""}        />
      </Box>
      {/* Interaction Buttons */}
      <Box mt="2" display="flex" justifyContent="space-between">
        <IconButton icon={<ChevronDownIcon />} onClick={handleNextHighlight} aria-label={""} />
        <Box>
          <IconButton icon={<HeartIcon />} onClick={handleLike} aria-label={""} />
          <IconButton icon={<ChatIcon />} onClick={handleComment} aria-label={""} />
          <IconButton icon={<ShareIcon />} onClick={handleShare} aria-label={""} />
        </Box>
      </Box>
      {/* Metadata */}
      <Text mt="2" fontSize="sm" color="gray.500">
        Podcast Title: {highlight.title}
      </Text>
    </Box>
  );
};

export default PodcastHighlight;
