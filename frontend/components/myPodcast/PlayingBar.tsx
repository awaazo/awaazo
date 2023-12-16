import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Icon,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import PlayingHelper from "../../helpers/PlayingHelper";
import { BiSolidBookmark } from "react-icons/bi";

import { MdMoreVert } from "react-icons/md";

const PlayComponent = ({
  podcastId,
  episodeId,
  sections,
  onStartChange,
  onEndChange,
  isAdding,
}) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // State to manage the positions of the start and end bookmarks
  const [startBookmarkPosition, setStartBookmarkPosition] = useState(0);
  const [endBookmarkPosition, setEndBookmarkPosition] = useState(0);

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const audioUrl = await PlayingHelper.getEpisodePlaying(
          podcastId,
          episodeId,
        );
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
      setIsLoading(false);
    };

    fetchAudio();
  }, [podcastId, episodeId]);

  useEffect(() => {
    // Set initial positions based on the last section's end time and the next section's start time (or 0 if they don't exist)
    const lastSectionEndTime =
      sections?.length > 0 ? sections[sections.length - 1].end : 0;
    const lastSectionStartTime = duration;

    setStartBookmarkPosition((lastSectionEndTime / duration) * 100);
    onStartChange(lastSectionEndTime);
    setEndBookmarkPosition((lastSectionStartTime / duration) * 100);
    onEndChange(duration - 1);

    setCurrentTime(isAdding ? lastSectionEndTime : 0);
    audioRef.current.currentTime = isAdding ? lastSectionEndTime : 0;
  }, [isAdding, sections]);

  useEffect(() => {
    console.log("Audio URL:", audioUrl);
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Error playing audio:", e);
        // Handle the error (e.g., show an error message to the user)
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", setAudioData);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Function to format time in mm:ss format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // Function to find the section at the current time
  const getCurrentSection = () => {
    if (!sections || !Array.isArray(sections)) {
      return null;
    }

    for (const section of sections) {
      if (currentTime >= section.start && currentTime <= section.end) {
        return section;
      }
    }

    return null;
  };

  // Get the current section
  const currentSection = getCurrentSection();

  // Handles displaying teh section title
  const [showSectionTitle, setShowSectionTitle] = useState(false);

  const handleMouseEnter = () => {
    setShowSectionTitle(true);
  };

  const handleMouseLeave = () => {
    setShowSectionTitle(false);
  };

  // Handles Start Changes
  const handleStartChange = () => {
    onStartChange(currentTime);
    setStartBookmarkPosition((currentTime / duration) * 100);
  };

  // Handles End Changes
  const handleEndChange = () => {
    onEndChange(currentTime);
    setEndBookmarkPosition((currentTime / duration) * 100);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      p={2}
      m={3}
      bg="gray.500"
      borderRadius="lg"
      boxShadow="md"
      width="130%"
      position="relative"
    >
      {audioUrl ? (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            size="md"
            variant="ghost"
            mr={2}
            borderRadius="full"
          />
          <Box flex="1" mx={5} mt={1} textAlign="center">
            <Slider
              min={0}
              max={duration}
              value={isAdding ? currentTime : currentTime}
              minWidth={"100px"}
              onChange={(value) => handleSeek(value)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={3} />
              <SliderThumb boxSize={3} />
              {/* Display marks for all sections */}
              {sections &&
                sections.map((section, key) => (
                  <React.Fragment key={key}>
                    {/* Mark for section start */}
                    <Icon
                      as={BiSolidBookmark}
                      position="absolute"
                      left={`${(section.start / duration) * 100 - 3.5}%`}
                      top="-3px"
                      boxSize={5}
                      opacity={0.7}
                    />
                    <Tooltip
                      label={section?.title}
                      placement="top"
                      position="absolute"
                      openDelay={900}
                      bg="transparent"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="xl"
                      fontSize="xs"
                      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                    >
                      <Icon
                        as={BiSolidBookmark}
                        position="absolute"
                        left={`${(section.end / duration) * 100 - 3.5}%`}
                        top="-3px"
                        boxSize={5}
                        opacity={0.7}
                      />
                    </Tooltip>

                    <Text
                      position="absolute"
                      left={`${(section.end / duration) * 100 - 1}%`}
                      top="12px"
                      fontSize="xs"
                      color="white"
                      fontWeight={"bold"}
                    >
                      {key + 1}
                    </Text>
                  </React.Fragment>
                ))}

              {isAdding && (
                <>
                  <Tooltip label="Set Start Time" placement="top">
                    <Box
                      position="absolute"
                      left={`${startBookmarkPosition}%`}
                      cursor={isAdding ? "grab" : "default"}
                    >
                      <Icon
                        as={BiSolidBookmark}
                        position="absolute"
                        top="-10px"
                        left="-10px"
                        boxSize={6}
                        color={"#445670"}
                        opacity={1}
                        style={{ cursor: isAdding ? "grab" : "default" }}
                      />
                    </Box>
                  </Tooltip>
                  <Tooltip label="Set End Time" placement="top">
                    <Box
                      position="absolute"
                      left={`${endBookmarkPosition}%`}
                      cursor={isAdding ? "grab" : "default"}
                    >
                      <Icon
                        as={BiSolidBookmark}
                        position="absolute"
                        top="-10px"
                        left="-10px"
                        boxSize={6}
                        color={"#445670"}
                        opacity={1}
                        style={{ cursor: isAdding ? "grab" : "default" }}
                      />
                    </Box>
                  </Tooltip>
                </>
              )}
            </Slider>
          </Box>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMoreVert />}
              size="lg"
              variant="ghost"
              borderRadius="full"
              mr={2}
            />
            <MenuList>
              <MenuItem onClick={() => setPlaybackSpeed(0.25)}>0.25x</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(0.5)}>0.5x</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(0.75)}>0.75x</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(1)}>Normal</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(1.25)}>1.25x</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(1.5)}>1.5x</MenuItem>
              <MenuItem onClick={() => setPlaybackSpeed(2)}>2x</MenuItem>
            </MenuList>
          </Menu>

          <Text color="white" mt={0.5}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
          <Box
            position="absolute"
            top="-40px"
            left="50%"
            transform="translateX(-50%)"
            textAlign="center"
          ></Box>
        </Box>
      ) : (
        <Box textAlign="center" p={3} color="red.500" borderRadius="lg">
          Unable to load audio
        </Box>
      )}
      {isAdding && (
        <HStack spacing={4} justifyContent="center" mt={4}>
          <Button onClick={handleStartChange} variant="ghost">
            Set Start Time
          </Button>
          <Button onClick={handleEndChange} variant="ghost">
            Set End Time
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default PlayComponent;
