import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, IconButton, Image, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, useColorModeValue, useBreakpointValue, Link } from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward } from "react-icons/fa";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";

import CommentComponent from "../social/commentComponent";
import LikeComponent from "../social/likeComponent";
import { convertTime } from "../../utilities/commonUtils";
import { usePalette } from "color-thief-react";
import EndpointHelper from "../../helpers/EndpointHelper";
import { usePlayer } from "../../utilities/PlayerContext";

const PlayerBar = () => {
  // State and Context Hooks
  const { state, dispatch, audioRef } = usePlayer();
  const { episode } = state;
  const isEpisodeLoaded = !!episode;
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  // Responsive Design Hooks
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  // Function to fetch episode URL
  const getEpisodePlaying = async (podcastId, episodeId) => {
    return EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId);
  };

  // Effect Hooks
  // Fetch and load audio URL
  useEffect(() => {
    const fetchAudio = async () => {
      if (isPlaying) togglePlayPause();
      setIsLoading(true);
      try {
        const url = await getEpisodePlaying(episode.podcastId, episode.id);
        setAudioUrl(url);
      } catch (error) {
        console.error("Error fetching episode:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isEpisodeLoaded) fetchAudio();
  }, [episode]);

  // Load the audio when the URL changes
  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
    }
  }, [audioUrl]);

  // Play/Pause, Muting, and Playback Speed Handling
  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // UI Interaction Handlers
  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 30 : 0);
  };

  const handleSeek = (newValue) => {
    const seekTime = Number(newValue);
    audioRef.current.currentTime = seekTime;
    setPosition(seekTime);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `downloaded_audio.mp3`; // Dynamically set filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Skip Forward/Backward
  const skipAmount = 10; // seconds
  const skipForward = () => {
    const newPosition = Math.min(position + skipAmount, duration);
    audioRef.current.currentTime = newPosition;
    setPosition(newPosition);
  };

  const skipBackward = () => {
    const newPosition = Math.max(position - skipAmount, 0);
    audioRef.current.currentTime = newPosition;
    setPosition(newPosition);
  };

  // Display Logic
  const timeLeft = isEpisodeLoaded ? convertTime(episode.duration - position) : "0:00";
  const thumbnailUrl = isEpisodeLoaded ? episode.thumbnailUrl : "/awaazo_bird_aihelper_logo.svg";
  const { data: palette } = usePalette(thumbnailUrl, 2, "rgbArray", {
    crossOrigin: "Anonymous",
    quality: 10,
  });

  return (
    <Box
      maxWidth="92%"
      p={4}
      borderRadius="2em"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      shadow="md"
      style={{ backdropFilter: "blur(50px)" }}
      border="3px solid rgba(255, 255, 255, 0.05)"
      boxShadow="0px 0px 15px rgba(0, 0, 0, 0.4)"
      position="fixed"
      left="50%"
      transform="translateX(-50%)"
      width="100%"
      zIndex={999}
      bottom={"1em"}
    >
   <Flex justifyContent="space-between" alignItems="center">
        {/* Episode Info */}
        <Flex alignItems="center">
          {isEpisodeLoaded ? (
            <Link href={`/NowPlaying/${episode.id}`}>
                <Image 
                  boxSize={isMobile ? "30px" : "40px"} 
                  src={episode.thumbnailUrl}
                  borderRadius="full" 
                  mr={4} 
                  objectFit="cover" 
                  cursor="pointer"
                />
            </Link>
          ) : (
            <Image 
              boxSize={isMobile ? "30px" : "40px"} 
              src="/awaazo_bird_aihelper_logo.svg"
              borderRadius="full" 
              mr={4} 
              objectFit="cover" 
            />
          )}
          <Box>
            <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"} color={useColorModeValue("gray.900", "gray.100")}>
              {isEpisodeLoaded ? episode.episodeName : "Unknown"}
            </Text>
            <Text fontSize={isMobile ? "xs" : "sm"} color="gray.500">
              {isEpisodeLoaded ? episode.podcaster : ""}
            </Text>
          </Box>
        </Flex>

        {/* Player Controls */}
        <Flex alignItems="center">
          <IconButton aria-label="Previous Episode" icon={<FaStepBackward />} variant="ghost" size="sm" onClick={() => {}} mr={2} />
          <IconButton aria-label="Skip Backward" icon={<FaArrowRotateLeft />} variant="ghost" size="sm" onClick={skipBackward} mr={2} />
          <IconButton aria-label={isPlaying ? "Pause" : "Play"} icon={isPlaying ? <FaPause /> : <FaPlay />} variant="ghost" size="sm" onClick={togglePlayPause} mr={2} />
          <IconButton aria-label=" Skip Forward" icon={<FaArrowRotateRight />} variant="ghost" size="sm" onClick={skipForward} mr={2} />
          <IconButton aria-label=" Next Episode" icon={<FaStepForward />} variant="ghost" size="sm" onClick={() => {}} />
        </Flex>

        {/* Slider - Hidden in mobile */}
        {!isMobile && (
          <Flex width="60%" mx={4} alignItems="center">
            <Text mr={3} fontSize="sm" fontWeight="bold">
              {convertTime(position)}
            </Text>
            <Slider aria-label="Track Timeline" value={position} max={duration} onChange={(val) => handleSeek(val)}>
              <SliderTrack bg="transparent"></SliderTrack>
              <SliderTrack>
                <SliderFilledTrack bgGradient={palette?.length >= 2 ? `linear(to-l, rgba(${palette[0].join(",")}, 0.5), rgba(${palette[1].join(",")}, 0.5))` : "black"} />
              </SliderTrack>
            </Slider>

            <Text ml={3} fontSize="sm" fontWeight="bold">
              {timeLeft}
            </Text>
          </Flex>
        )}

        {/* Like and Comment - Hidden in mobile */}
        {!isMobile && (
          <Flex alignItems="center">
            <LikeComponent episodeOrCommentId={isEpisodeLoaded ? episode.id : "default-id"} initialLikes={isEpisodeLoaded ? episode.likes : 0} />
            <CommentComponent episodeIdOrCommentId={isEpisodeLoaded ? episode.id : "default-id"} initialComments={isEpisodeLoaded ? episode.comments.length : 0} />
          </Flex>
        )}

        {/* Volume Control - Hidden in mobile */}
        {!isMobile && !isTablet && (
          <Flex alignItems="center" ml={4} width={"7%"}>
            <IconButton aria-label={isMuted ? "Unmute" : "Mute"} icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />} variant="ghost" size="sm" onClick={toggleMute} />
            <Slider
              aria-label="Volume"
              value={isMuted ? 0 : volume}
              isDisabled={isMuted}
              onChange={(val) => {
                setVolume(val);
                setIsMuted(val === 0);
                audioRef.current.volume = val / 100;
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
