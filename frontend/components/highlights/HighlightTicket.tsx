import React, { useState, useEffect } from "react";
import axios from 'axios'; // Ensure axios is imported if not already
import { Box, Image, VStack, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { Highlight } from "../../types/Interfaces";
import { FaPlay, FaPause, FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";
import Likes from '../interactionHub/Likes'
import CommentButton from '../interactionHub/buttons/CommentButton'
import { usePalette } from "color-thief-react";
import HighlightHelper from "../../helpers/HighlightHelper";

  const HighlightTicket= ({episode, highlight }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio());
    const { dispatch, state } = usePlayer();
    const isMobile = useBreakpointValue({ base: true, md: false });
    
  const isEpisodeLoaded = !!episode
  const [episodeThumbnailUrl, setEpisodeThumbnailUrl] = useState('/awaazo_bird_aihelper_logo.svg'); // Default thumbnail
  const thumbnailUrl = episode ? episode.thumbnailUrl : '/awaazo_bird_aihelper_logo.svg';
  const { data: palette } = usePalette(thumbnailUrl, 2, 'rgbArray', { crossOrigin: 'Anonymous', quality: 10 });

  useEffect(() => {
    // This function fetches the episode thumbnail using the episode ID from the highlight
    const fetchEpisodeThumbnail = async () => {
      try {
        const response = await axios.get(`/api/episode/${highlight.episodeId}/thumbnail`);
        // Set the episode thumbnail URL state
        setEpisodeThumbnailUrl(response.data.thumbnailUrl);
      } catch (error) {
        console.error('Error fetching episode thumbnail:', error);
        // Optionally handle the error by setting a default thumbnail or user feedback
        setEpisodeThumbnailUrl('/awaazo_bird_aihelper_logo.svg'); // Default thumbnail
      }
    };
  
    if (highlight.episodeId) {
      fetchEpisodeThumbnail();
    }
  
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src'); // Clean up the src to release the audio file
        audio.load();
      }
    };
  }, [highlight]);

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
            audio.src = audioUrl; // Set the audio source
            audio.play(); // Play the audio
            setIsPlaying(true); // Update the state to reflect that audio is playing
        }
    } else {
        if (audio) {
            audio.pause(); // Pause the audio
            setIsPlaying(false); // Update the state to reflect that audio is paused
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
            borderRadius= "2xl"
        >
           {
                episode && (
                    <Image
                        src={episodeThumbnailUrl} // Changed from episode.thumbnailUrl
                        alt={`Highlight from ${highlight.Title || 'episode'}`}
                        fit="cover"
                        w="full"
                        h="full"
                        position="absolute"
                        zIndex="-1"
                        opacity="0.5"
                    />
                )
            }
            <VStack spacing={4} p={4} zIndex="1">
            
   
       
                <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={handlePlayPauseClick}
                    size="lg"
                    isRound
                    colorScheme="whiteAlpha"
                />
            </VStack>
            <Box
                position="absolute"
                bottom="20px"
                right="20px"
                zIndex="1"
            >
                
                <VStack spacing={2}>
                    <Likes episodeOrCommentId={episode.id } initialLikes={isEpisodeLoaded ? episode.likes : 0} showCount={false} />
                    <CommentButton episodeId={episode.id } initialComments={0} showCount={false} />
                <IconButton icon={<FaShare />} aria-label="Share" colorScheme="green" variant="ghost" />
                </VStack>
            </Box>
        </VStack>
    );
};

export default HighlightTicket;
