import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import { Box, Image, VStack, IconButton, useBreakpointValue, Text, Link } from "@chakra-ui/react";
import { FaPlay, FaPause, FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";
import Likes from '../interactionHub/Likes'
import CommentButton from '../interactionHub/buttons/CommentButton'
import HighlightHelper from "../../helpers/HighlightHelper";

  const HighlightTicket= ({episode, highlight, thumbnailUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio());
    const { dispatch, state } = usePlayer();
    const isMobile = useBreakpointValue({ base: true, md: false });
    
  const isEpisodeLoaded = !!episode
  
  useEffect(() => {
    return () => audio && audio.pause();
  }, [audio, highlight.id]);

const handlePlayPauseClick = () => {
    console.log('Play/Pause button clicked');
    console.log('Highlight object:', highlight);

    if (!isPlaying) {
        const audioUrl = HighlightHelper.getHighlightAudioEndpoint(highlight.highlightId);
        console.debug("Playing audio from URL:", audioUrl);
        if (audio && audioUrl) {
            audio.src = audioUrl; 
            audio.play(); 
            setIsPlaying(true); 
        }
    } else {
        if (audio) {
            audio.pause(); 
            setIsPlaying(false); 
        }
    }
};




return (
  <VStack
    spacing={4}
    align="center"
    justify="center"
    bg="blackAlpha.500"
    height="400px"
    width="300px"
    position="relative"
    borderRadius="2xl"
  >
    {
      episode && (
        <>
        <Image
          src={thumbnailUrl}
          alt={`Highlight from ${highlight.title || 'episode'}`}
          fit="cover"
          w="full"
          h="full"
          position="absolute"
          zIndex="-1"
          opacity="0.5"
        />
        <Box
            position="absolute"
            top="4" 
            width="full"
            textAlign="center" // Center-align the text
            p={2}
            borderRadius="md"
           
          >
            <Link href={`/NowPlaying/${episode.id}`} >
            <Text fontSize={["md", "lg"]} color="whiteAlpha.900" fontWeight="bold">
              Episode:{episode.episodeName} 
            </Text>
            </Link>
          </Box>
        </>
      )
    }
    <IconButton
      aria-label={isPlaying ? "Pause" : "Play"}
      icon={isPlaying ? <FaPause /> : <FaPlay />}
      onClick={handlePlayPauseClick}
      size="lg"
      isRound
      colorScheme="whiteAlpha"
      position="absolute"
      top="50%" 
      left="50%" 
      transform="translate(-50%, -50%)" 
    />
    <Box
      position="absolute"
      bottom="20px"
      right="20px"
      zIndex="1"
    >
      <VStack spacing={2}>
        <Likes episodeOrCommentId={episode.id} initialLikes={isEpisodeLoaded ? episode.likes : 0} showCount={false} />
        <CommentButton episodeId={episode.id} initialComments={0} showCount={false} />
      </VStack>
    </Box>
    <Box
      position="absolute"
      bottom="4" 
      width="full"
      p={4}
      bg="blackAlpha.300"
      borderRadius="md"
    >
    
      <Text fontSize={["md", "lg"]} color="whiteAlpha.900" fontWeight="bold" noOfLines={1}>
        {highlight.title}
      </Text>
      <Text fontSize={["sm", "md"]} color="whiteAlpha.800" noOfLines={2}>
        {highlight.description}
      </Text>
   
    </Box>
  </VStack>
);

};

export default HighlightTicket;
