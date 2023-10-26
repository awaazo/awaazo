import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, Image, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Badge, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import { FaStepForward, FaStepBackward, FaBackward, FaPlay, FaPause, FaForward, FaVolumeUp, FaVolumeDown, FaHeart, FaCommentAlt, FaBookmark } from "react-icons/fa";
import { Episode } from "../../utilities/Interfaces";
import { ChevronRightIcon } from '@chakra-ui/icons'
const awaazoBird = "/awaazo_bird_aihelper_logo.svg";

const PlayerBar: React.FC<Episode> = (props) => {
  const { coverArt, episodeName = "Unknown episodeName", podcaster = "Unknown Podcaster", duration, likes, comments, sections = [] } = props;

  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(likes.isLiked);
  
  
  const togglePlayPause = () => setIsPlaying(prevIsPlaying => !prevIsPlaying);
  const skipForward = () => setPosition(prevPos => Math.min(prevPos + 10, duration));
  const skipBackward = () => setPosition(prevPos => Math.max(prevPos - 10, 0));
  const handleCoverClick = () => console.log("Navigating to player page...");
  const handleLikeClick = () => setIsLiked(!isLiked);
  const handleCommentClick = () => console.log('Open comment box...'); 
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const currentTime = `${Math.floor(position / 60)}:${String(position % 60).padStart(2, "0")}`;
  const timeLeft = `${Math.floor((duration - position) / 60)}:${String((duration - position) % 60).padStart(2, "0")}`;
  const likedColor = isLiked ? "red.500" : useColorModeValue("gray.900", "gray.100");
  const commentedColor = comments.isCommented ? "blue.500" : useColorModeValue("gray.900", "gray.100");
  
  const handleScrubberChange = (newPosition: number) => setPosition(newPosition);
  const getCurrentSectionName  = (currentTime: string): string => {
    const timeParts = currentTime.split(":");
    const totalSeconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
    for (let i = sections.length - 1; i >= 0; i--) {
      if (totalSeconds >= sections[i].startTime) {
        return sections[i].sectionName;
      }
    }
    return "";
  };
  return (
    <Box boxSizing="border-box" position="sticky" bottom={0} left={0} right={0} p={4} m={3} borderRadius={"25px"} bg={useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)")} shadow="md">
      {" "}
      {isMobile ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" onClick={handleCoverClick} cursor="pointer">
            <Image boxSize="30px" src={coverArt} borderRadius="full" mr={4} />
            <Box>
              <Text fontWeight="bold" color={useColorModeValue("gray.900", "gray.100")} fontSize="sm">
                {episodeName}
              </Text>
              <Text color="gray.500" fontSize="xs">
                {podcaster}
              </Text>
            </Box>
          </Flex>
          <IconButton aria-label={isPlaying ? "Pause" : "Play"} icon={isPlaying ? <FaPause /> : <FaPlay />} variant="ghost" size="sm" onClick={togglePlayPause} />
        </Flex>
      ) : (
        <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center">
          {/* Left Side - Cover Art, episodeName, Podcaster */}
          <Flex direction={{ base: "column", md: "row" }} alignItems="center" mb={{ base: 2, md: 0 }} mr={4} onClick={handleCoverClick} cursor="pointer">
            <Image boxSize={{ base: "30px", md: "40px" }} src={coverArt} borderRadius="full" mb={{ base: 2, md: 0 }} mr={4} />
            <Box mb={{ base: 2, md: 0 }}>
              <Text fontWeight="bold" color={useColorModeValue("gray.900", "gray.100")} fontSize={{ base: "sm", md: "md" }}>
                {episodeName}
              </Text>
              <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                {podcaster}
              </Text>
            </Box>
            <Flex ml={4} alignItems="center">
        <Box position="relative">
          <IconButton aria-label="Like" icon={<FaHeart />} variant="ghost" color={isLiked ? "red.500" : likedColor} size="sm" onClick={handleLikeClick} />
          
              </Box>

              <Box position="relative" ml={2}>
          <IconButton aria-label="Comment" icon={<FaCommentAlt />} variant="ghost" color={commentedColor} size="sm" onClick={handleCommentClick} />
          
              </Box>
            </Flex>
          </Flex>

          {/* Middle - Controls */}
          <Flex flexDirection="column" alignItems="center" flex={1}>
            <Flex alignItems="center" justifyContent="center" width="100%" mb={2}>
              <IconButton aria-label="Skip 10 seconds Backward" icon={<FaStepBackward />} variant="ghost" size="sm" onClick={skipBackward} mr={2} />
              <IconButton aria-label="Previous Track" icon={<FaBackward />} variant="ghost" size="sm" onClick={() => {}} mr={2} />
              <IconButton aria-label={isPlaying ? "Pause" : "Play"} icon={isPlaying ? <FaPause /> : <FaPlay />} variant="ghost" size="sm" onClick={togglePlayPause} mr={2} />
              <IconButton aria-label="Next Track" icon={<FaForward />} variant="ghost" size="sm" onClick={() => {}} mr={2} />
              <IconButton aria-label="Skip 10 seconds Forward" icon={<FaStepForward />} variant="ghost" size="sm" onClick={skipForward} />
            </Flex>

            {/* Timeline Scrubber */}
            <Flex alignItems="center" justifyContent="space-between" width="100%">
              <Box width="80px" textAlign="right" mr={2}>
                <Text color="gray.500" fontSize="sm">
                  {currentTime} . {getCurrentSectionName (currentTime)}
                </Text>
              </Box>
              <Box flex={1} position="relative" mx={4}>
                <Slider aria-label="Track Timeline" value={position} max={duration} min={0} width="full" onChange={handleScrubberChange}>
                  <SliderTrack bg="gray.500">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={4}>
                  <Box color='tomato' />
                  </SliderThumb>
                </Slider>
                {sections.map((section, index) => (
                  <Box key={index} position="absolute" height="2px" bg="gray.300" left={`${(section.startTime / duration) * 100}%`} width="1px" top="50%" transform="translateY(-50%)" />
                ))}
              </Box>
              <Box width="80px" textAlign="left" ml={2}>
                <Text color="gray.500" fontSize="sm">
                  {timeLeft}
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* Right Side - Volume Control and Icons */}
          <Flex alignItems="center" direction={{ base: "row", md: "row" }} mt={{ base: 2, md: 0 }} ml={4}>
            <IconButton aria-label="Volume Down" icon={<FaVolumeDown />} variant="ghost" size="sm" />
            <Slider aria-label="Volume" defaultValue={30} max={100} min={0} width="80px">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={4}>
                <Box />
              </SliderThumb>
            </Slider>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default PlayerBar;
