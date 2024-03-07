import { Box, Image, Text, VStack, IconButton, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { Highlight } from "../../types/Interfaces";
import { FaPlay, FaPause, FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";

const HighlightTicket: React.FC<{ highlight: Highlight }> = ({ highlight }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const { dispatch } = usePlayer();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handlePlayPauseClick = () => {
        setIsPlaying(!isPlaying);
        // Here you'd trigger the actual play/pause functionality, potentially via the usePlayer context
        // For the sake of example, we're toggling state
    };

    const handleEpisodeClick = () => {
        // Navigate to the full episode
        // This would involve using your routing library (e.g., React Router) to change the view
    };

    return (
        <VStack
            spacing={4}
            align="center"
            justify="center"
            bg="blackAlpha.500"
            height="100vh" // Fullscreen for immersive experience
            position="relative"
            onClick={handleEpisodeClick} // Navigate on click
        >
            <Image
                src={highlight.thumbnailUrl}
                alt={`Highlight from ${highlight.episodeName}`}
                fit="cover"
                w="full"
                h="full"
                position="absolute"
                zIndex="-1"
                opacity="0.5"
            />
            <VStack spacing={4} p={4} zIndex="1">
                <Text fontSize="xl" color="white" fontWeight="bold">
                    {highlight.episodeName}
                </Text>
                <Text fontSize="md" color="whiteAlpha.800">
                    {highlight.podcastName}
                </Text>
                {/* Controls */}
                <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={handlePlayPauseClick}
                    size="lg"
                    isRound
                    colorScheme="whiteAlpha"
                />
            </VStack>
            {/* Engagement Icons */}
            <Box
                position="absolute"
                bottom="20px"
                right="20px"
                zIndex="1"
            >
                <VStack spacing={2}>
                    <IconButton icon={<FaHeart />} aria-label="Like" colorScheme="red" variant="ghost" />
                    <IconButton icon={<FaCommentDots />} aria-label="Comment" colorScheme="blue" variant="ghost" />
                    <IconButton icon={<FaShare />} aria-label="Share" colorScheme="green" variant="ghost" />
                </VStack>
            </Box>
        </VStack>
    );
};

export default HighlightTicket;
