import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaCommentAlt,
  FaVolumeUp,
  FaVolumeMute,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { Episode } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";
import { usePalette } from "color-thief-react";

const PlayerBar: React.FC<Episode> = ({
  thumbnailUrl,
  episodeName = "Unknown Episode",
  podcaster = "Unknown Podcaster",
  duration,
  likes,
  comments,
  sections = [],
}) => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(likes.isLiked);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  // Helper functions for player control
  const skipAmount = 10; // seconds
  const skipForward = () =>
    setPosition((prevPos) => Math.min(prevPos + skipAmount, duration));
  const skipBackward = () =>
    setPosition((prevPos) => Math.max(prevPos - skipAmount, 0));
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 30 : 0);
  };

  // Breakpoint detection for responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Section and time display logic
  const currentTime = convertTime(position);
  const timeLeft = convertTime(duration - position);
  const getCurrentSectionName = () => {
    const totalSeconds = position;
    return (
      sections
        .slice()
        .reverse()
        .find((section) => totalSeconds >= section.timestamp)?.title || ""
    );
  };

  // Color mode and palette detection
  const likedColor = useColorModeValue("gray.900", "gray.100");
  const commentedColor = useColorModeValue("gray.900", "gray.100");

  const { data: palette } = usePalette(thumbnailUrl, 2, "rgbArray", {
    crossOrigin: "Anonymous",
    quality: 10,
  });

  return (
    <Box
      boxSizing="border-box"
      position="sticky"
      bottom={4}
      left={0}
      right={0}
      p={4}
      m={3}
      borderRadius="2em"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      shadow="md"
      style={{ backdropFilter: "blur(50px)" }}
      border="3px solid rgba(255, 255, 255, 0.05)"
      boxShadow="0px 0px 15px rgba(0, 0, 0, 0.4)"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Episode Info */}
        <Flex
          alignItems="center"
          onClick={() => console.log("Navigating to player page...")}
          cursor="pointer"
        >
          <Image
            boxSize={isMobile ? "30px" : "40px"}
            src={thumbnailUrl}
            borderRadius="full"
            mr={4}
            objectFit="cover"
          />
          <Box>
            <Text
              fontWeight="bold"
              fontSize={isMobile ? "sm" : "md"}
              color={useColorModeValue("gray.900", "gray.100")}
            >
              {episodeName}
            </Text>
            <Text fontSize={isMobile ? "xs" : "sm"} color="gray.500">
              {podcaster}
            </Text>
          </Box>
        </Flex>

        {/* Player Controls */}
        <Flex alignItems="center">
          <IconButton
            aria-label="Previous Episode"
            icon={<FaStepBackward />}
            variant="ghost"
            size="sm"
            onClick={() => {}}
            mr={2}
          />
          <IconButton
            aria-label="Skip Backward"
            icon={<FaArrowRotateLeft />}
            variant="ghost"
            size="sm"
            onClick={skipBackward}
            mr={2}
          />
          <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            mr={2}
          />
          <IconButton
            aria-label=" Skip Forward"
            icon={<FaArrowRotateRight />}
            variant="ghost"
            size="sm"
            onClick={skipForward}
            mr={2}
          />
          <IconButton
            aria-label=" Next Episode"
            icon={<FaStepForward />}
            variant="ghost"
            size="sm"
            onClick={() => {}}
          />
        </Flex>

        {/* Slider - Hidden in mobile */}
        {!isMobile && (
          <Flex width="50%" mx={4} alignItems="center">
            <Text mr={3} fontSize="sm" fontWeight="bold">
              {currentTime}
            </Text>
            <Slider
              aria-label="Track Timeline"
              value={position}
              max={duration}
              onChange={(val) => setPosition(val)}
            >
              <SliderTrack bg="transparent"></SliderTrack>
              <SliderTrack>
                <SliderFilledTrack
                  bgGradient={
                    palette?.length >= 2
                      ? `linear(to-l, rgba(${palette[0].join(
                          ",",
                        )}, 0.5), rgba(${palette[1].join(",")}, 0.5))`
                      : "black"
                  }
                />
              </SliderTrack>
              <Tooltip
                label={getCurrentSectionName()}
                placement="top"
                openDelay={900}
                bg="transparent"
                color="white"
                px={2}
                py={1}
                borderRadius="xl"
                fontSize="xs"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              >
                <SliderThumb boxSize={2} />
              </Tooltip>
            </Slider>

            <Text ml={3} fontSize="sm" fontWeight="bold">
              {timeLeft}
            </Text>
          </Flex>
        )}

        {/* Like and Comment - Hidden in mobile */}
        {!isMobile && (
          <Flex alignItems="center">
            <IconButton
              aria-label="Like"
              icon={<FaHeart />}
              variant="ghost"
              size="sm"
              color={isLiked ? "red.500" : likedColor}
              onClick={toggleLike}
            />
            <IconButton
              aria-label="Comment"
              icon={<FaCommentAlt />}
              variant="ghost"
              size="sm"
              color={comments.isCommented ? "blue.500" : commentedColor}
              onClick={() => console.log("Navigating to comments...")}
            />
          </Flex>
        )}

        {/* Volume Control - Hidden in mobile */}
        {!isMobile && (
          <Flex alignItems="center" ml={4} width={"10%"}>
            <IconButton
              aria-label={isMuted ? "Unmute" : "Mute"}
              icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              variant="ghost"
              size="sm"
              onClick={toggleMute}
            />
            <Slider
              aria-label="Volume"
              value={isMuted ? 0 : volume}
              isDisabled={isMuted}
              onChange={(val) => {
                setVolume(val);
                setIsMuted(val === 0);
              }}
              mx={2}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default PlayerBar;
