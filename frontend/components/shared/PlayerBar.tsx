import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Flex, IconButton, Image, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward } from "react-icons/fa";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import CommentComponent from "../social/commentComponent";
import LikeComponent from "../social/likeComponent";
import BookmarkComponent from "../bookmarks/CreateBookmarkModule";
import { convertTime } from "../../utilities/commonUtils";
import { usePalette } from "color-thief-react";
import EndpointHelper from "../../helpers/EndpointHelper";
import { usePlayer } from "../../utilities/PlayerContext";

const PlayerBar = () => {
  const { state, dispatch, audioRef } = usePlayer();
  const { episode, currentEpisodeIndex } = state;
  const [currentIndex, setCurrentIndex] = useState(currentEpisodeIndex);
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

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: true, md: true, lg: false });

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

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
    }
  }, [audioUrl]);

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    const updatePosition = () => {
      dispatch({ type: "SET_CT", payload: audio.currentTime });
      setPosition(audio.currentTime);
    };
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", updatePosition);
    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", updatePosition);
    };
  }, []);

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

  const skipAmount = 10;
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

  const playNext = () => {
    dispatch({ type: "PLAY_NEXT" });
  };

  const playPrevious = () => {
    const currentTime = audioRef.current.currentTime;

    if (currentTime > 5) {
      // If current time is more than 5 seconds, reset time to 0
      audioRef.current.currentTime = 0;
    } else {
      // Otherwise, dispatch the "PLAY_PREVIOUS" action
      dispatch({ type: "PLAY_PREVIOUS" });
    }
  };

  const timeLeft = isEpisodeLoaded ? convertTime(Math.max(episode.duration - position, 0)) : "0:00";

  const thumbnailUrl = isEpisodeLoaded ? episode.thumbnailUrl : "/awaazo_bird_aihelper_logo.svg";
  const { data: palette } = usePalette(thumbnailUrl, 2, "rgbArray", {
    crossOrigin: "Anonymous",
    quality: 10,
  });

  return (
    <Box maxWidth="100%" p={1} pt={3} pb={5} bg="rgba(0, 0, 0, 0.2)" style={{ backdropFilter: "blur(50px)" }} position="fixed" left="50%" transform="translateX(-50%)" width="100%" zIndex={999} bottom={"0em"}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        {/* Episode Info */}
        <Flex alignItems="center" ml={2}>
          {isEpisodeLoaded ? (
            <Link href={`/NowPlaying/${episode.id}`} shallow>
              <Image boxSize={isMobile ? "30px" : "40px"} src={episode.thumbnailUrl} borderRadius="base" mr={4} objectFit="cover" cursor="pointer" />
            </Link>
          ) : (
            <Image boxSize={isMobile ? "30px" : "40px"} src="/awaazo_bird_aihelper_logo.svg" borderRadius="full" mr={4} objectFit="cover" />
          )}
          <Box>
            <Text fontWeight="bold" fontSize={isMobile ? "sm" : "md"}>
              {isEpisodeLoaded ? episode.episodeName : "Unknown Episode"}
            </Text>
            <Text fontSize={isMobile ? "xs" : "sm"} color="gray.500">
              {isEpisodeLoaded ? episode.podcastName : "Unknown Podcaster"}{" "}
            </Text>
          </Box>
        </Flex>

        <Flex flexDirection="column" width="45%" justifyContent="space-between" alignItems="center">
          {/* Player Controls */}
          <Flex alignItems="center" mb="5px">
            <IconButton aria-label="Previous Episode" icon={<FaStepBackward />} variant="ghost" size="sm" onClick={playPrevious} mr={2} data-cy={`play-previous`} />
            <IconButton aria-label="Skip Backward" icon={<FaArrowRotateLeft />} variant="ghost" size="sm" onClick={skipBackward} mr={2} data-cy={`skip-backward`} />
            <IconButton aria-label={isPlaying ? "Pause" : "Play"} icon={isPlaying ? <FaPause /> : <FaPlay />} variant="gradient" size="md" onClick={togglePlayPause} mr={2} data-cy={`play-pause-button`} />
            <IconButton aria-label=" Skip Forward" icon={<FaArrowRotateRight />} variant="ghost" size="sm" onClick={skipForward} mr={2} data-cy={`skip-forward`} />
            <IconButton aria-label=" Next Episode" icon={<FaStepForward />} variant="ghost" size="sm" onClick={playNext} data-cy={`play-next`} />
          </Flex>

          {/* Slider */}
          {!isMobile && (
            <Flex width="100%" mx={4} alignItems="center">
              <Text data-cy={`time-passed-${convertTime(position)}`} mr={3} fontSize="xs" fontWeight="medium">
                {convertTime(position)}
              </Text>
              <Slider aria-label="Track Timeline" value={position} max={duration} onChange={(val) => handleSeek(val)}>
                <SliderTrack bg="transparent"></SliderTrack>
                <SliderTrack>
                  <SliderFilledTrack bg="brand.100" />
                </SliderTrack>
              </Slider>

              <Text data-cy={`time-left-${timeLeft}`} ml={3} fontSize="xs" fontWeight="medium">
                {timeLeft}
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Like and Comment - Hidden in mobile */}

        {!isMobile && (
          <Flex alignItems="center" mr={2}>
            <Flex alignItems="center" mr={2}>
              <BookmarkComponent episodeId={isEpisodeLoaded ? episode.id : "default-id"} selectedTimestamp={isEpisodeLoaded ? position : 0} />
              <LikeComponent episodeOrCommentId={isEpisodeLoaded ? episode.id : "default-id"} initialLikes={isEpisodeLoaded ? episode.likes : 0} />
              <CommentComponent episodeIdOrCommentId={isEpisodeLoaded ? episode.id : "default-id"} initialComments={isEpisodeLoaded ? episode.comments.length : 0} />
            </Flex>

            {/* Volume Control Section */}
            {!isTablet && (
              <Box display="contents" alignItems="center">
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
                  width="5rem"
                >
                  <SliderTrack bg="gray.500">
                    <SliderFilledTrack bg="brand.100" />
                  </SliderTrack>
                  <SliderThumb boxSize={2} bg="brand.100" />
                </Slider>
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default PlayerBar;
