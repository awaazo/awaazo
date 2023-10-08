import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton, Image, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Badge, useColorModeValue } from "@chakra-ui/react";
import { FaStepForward, FaStepBackward, FaBackward, FaPlay, FaPause, FaForward, FaVolumeUp, FaVolumeDown, FaHeart, FaCommentAlt, FaBookmark } from "react-icons/fa";
import { Podcast } from "../../utilities/Types";

const PlayerBar: React.FC<Podcast> = (props) => {
  const { coverArt, episodeName = "Unknown episodeName", podcaster = "Unknown Podcaster", duration, likes, comments, isBookmarked = false, sections = [] } = props;

  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(props.isPlaying);
  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };
  const skipForward = () => {
    setPosition(Math.min(position + 10, duration));
  };

  const skipBackward = () => {
    setPosition(Math.max(position - 10, 0));
  };

  const currentTime = `${Math.floor(position / 60)}:${String(position % 60).padStart(2, "0")}`;
  const timeLeft = `${Math.floor((duration - position) / 60)}:${String((duration - position) % 60).padStart(2, "0")}`;
  const likedColor = likes.isLiked ? "red.500" : useColorModeValue("gray.900", "gray.100");
  const commentedColor = comments.isCommented ? "blue.500" : useColorModeValue("gray.900", "gray.100");
  const bookmarkedColor = isBookmarked ? "yellow.500" : useColorModeValue("gray.900", "gray.100");
  const handleScrubberChange = (position: number) => {
    setPosition(position);
  };

  const getSectionEpisodeName = (currentTime: string): string => {
    const timeParts = currentTime.split(":");
    const totalSeconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);

    for (let i = sections.length - 1; i >= 0; i--) {
      if (totalSeconds >= sections[i].startTime) {
        return sections[i].episodeName;
      }
    }
    return "";
  };

  return (
    <Box position="fixed" bottom={0} left={0} right={0} p={4} m={3} borderRadius={"25px"} bg={useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)")} shadow="md">
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center">
        {/* Left Side - Cover Art, episodeName, Podcaster */}
        <Flex direction={{ base: "column", md: "row" }} alignItems="center" mb={{ base: 2, md: 0 }} mr={4}>
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
              <IconButton aria-label="Like" icon={<FaHeart />} variant="ghost" color={likedColor} size="sm" />
              <Badge position="absolute" top="0" right="0" variant="solid" colorScheme="red" borderRadius={"100%"}>
                {likes.count}
              </Badge>
            </Box>

            <Box position="relative" ml={2}>
              <IconButton aria-label="Comment" icon={<FaCommentAlt />} variant="ghost" color={commentedColor} size="sm" />
              <Badge position="absolute" top="0" right="0" variant="solid" colorScheme="blue" borderRadius={"100%"}>
                {comments.count}
              </Badge>
            </Box>

            <IconButton aria-label="Bookmark" icon={<FaBookmark />} variant="ghost" color={bookmarkedColor} size="sm" ml={2} />
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
            <Text color="gray.500" fontSize="sm">
              {currentTime} . {getSectionEpisodeName(currentTime)}
            </Text>
            <Box flex={1} mx={4} position="relative">
              <Slider aria-label="Track Timeline" value={position} max={duration} min={0} width="full" onChange={handleScrubberChange}>
                <SliderTrack bg="gray.500">
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb boxSize={4}>
                  <Box color="tomato" />
                </SliderThumb>
              </Slider>
              {sections.map((section, index) => (
                <Box key={index} position="absolute" height="2px" bg="gray.300" left={`${(section.startTime / duration) * 100}%`} width="1px" top="50%" transform="translateY(-50%)" />
              ))}
            </Box>
            <Text color="gray.500" fontSize="sm">
              {timeLeft}
            </Text>
          </Flex>
        </Flex>

        {/* Right Side - Volume Control and Icons */}
        <Flex alignItems="center" direction={{ base: "row", md: "row" }} mt={{ base: 2, md: 0 }} ml={4}>
          <IconButton aria-label="Volume Down" icon={<FaVolumeDown />} variant="ghost" size="sm" />
          <Slider aria-label="Volume" defaultValue={30} max={100} min={0} width="80px">
            <SliderTrack bg="white">
              <SliderFilledTrack bg="tomato" />
            </SliderTrack>
            <SliderThumb boxSize={4}>
              <Box color="tomato" />
            </SliderThumb>
          </Slider>
          <IconButton aria-label="Volume Up" icon={<FaVolumeUp />} variant="ghost" size="sm" ml={2} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default PlayerBar;
