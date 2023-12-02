import React, { useState, useEffect, useRef } from "react";
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
import { Bookmark, Episode } from "../../utilities/Interfaces";
import CommentComponent from "../social/commentComponent";
import LikeComponent from "../social/likeComponent";
import BookmarkComponent from "../social/bookmarkComponent";
import { convertTime } from "../../utilities/commonUtils";
import { usePalette } from "color-thief-react";
import PlayingHelper from "../../helpers/PlayingHelper";
import { usePlayer } from "../../utilities/PlayerContext";
import SocialHelper from "../../helpers/SocialHelper";
import PodcastHelper from "../../helpers/PodcastHelper";

const PlayerBar = () => {
  const { state, dispatch, audioRef } = usePlayer();
  const { episode } = state;
  if (!episode) {
    return null;
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  // Fetch audio from backend using the episode and podcast Ids
  useEffect(() => {
    const fetchAudio = async () => {
      if (isPlaying) {
        togglePlayPause();
      }
      setIsLoading(true);
      try {
        const audioUrl = await PlayingHelper.getEpisodePlaying(
          episode.podcastId,
          episode.id,
        );
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
      setIsLoading(false);
    };

    fetchAudio();
  }, [episode]);

  // Load the audio url
  useEffect(() => {
    console.log("Audio URL:", audioUrl);
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
    }
  }, [audioUrl]);

  // Handle playing/pausing the audio when the button is pressed
  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  // Handle muting the audio when the mute button is pressed
  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  // Handles the play/pause button
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Sets the duration of the audio
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

  // Changes postion when slider or skip buttons are clicked
  const handleSeek = (newValue) => {
    const seekTime = Number(newValue);
    audioRef.current.currentTime = seekTime;
    setPosition(seekTime);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `downloaded_audio.mp3`; // You can dynamically set the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Helper functions for player control
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
  const toggleLike = () => setIsLiked(!isLiked);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 30 : 0);
  };

  // Breakpoint detection for responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Section and time display logic
  const currentTime = convertTime(position);
  const timeLeft = convertTime(episode.duration - position);
  /*const getCurrentSectionName = () => {
    const totalSeconds = position;
    return (
      episode.sections
        .slice()
        .reverse()
        .find((section) => totalSeconds >= section.timestamp)?.title || ""
    );
  };*/

  // Fetch episode details and transform bookmarks
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      const response = await PodcastHelper.getEpisodeById(
        episode.id,
      );
      if (response.status === 200) {
        if (response.episode) {
          // Transform the bookmarks to match our format
          const transformedBookmarks = response.episode.bookmarks.map(
            (bookmark) => ({
              id: bookmark.id,
              title: bookmark.title,
              note: bookmark.note,
              timestamp: bookmark.timestamp,
            }),
          );
          setBookmarks(transformedBookmarks);
        }
      } else {
        console.error("Error fetching episode details for bookmarks:", response.message);
      }
    };
    fetchEpisodeDetails();
}, [episode.id]);

  // Color mode and palette detection
  const likedColor = useColorModeValue("gray.900", "gray.100");
  const commentedColor = useColorModeValue("gray.900", "gray.100");

  const { data: palette } = usePalette(episode.thumbnailUrl, 2, "rgbArray", {
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
      width="100%"
      zIndex={999}
      bottom={"1em"}
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
            src={episode.thumbnailUrl}
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
              {episode.episodeName}
            </Text>
            <Text fontSize={isMobile ? "xs" : "sm"} color="gray.500">
              {episode.podcaster}
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
              {convertTime(position)}
            </Text>
            <Slider
              aria-label="Track Timeline"
              value={position}
              max={duration}
              onChange={(val) => handleSeek(val)}
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
              {/* MAKES SEARCH UNFUCNTIONAL
              <Tooltip
                // label={getCurrentSectionName()}
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
              </Tooltip>*/}

              {bookmarks.map((bookmark) => (
                <Box
                  position="absolute"
                  left={`${(bookmark.timestamp / duration) * 100}%`}
                  top="50%"
                  transform="translate(-50%, -50%)"
                  h="100%"
                  w="2px"
                  bg="red.500"
                />
              ))
              }
            </Slider>

            <Text ml={3} fontSize="sm" fontWeight="bold">
              {timeLeft}
            </Text>
          </Flex>
        )}

        {/* Like and Comment - Hidden in mobile */}
        
        {!isMobile && (
          <Flex alignItems="center">
            <BookmarkComponent
              episodeId={episode.id}
              selectedTimestamp={position}

            />
            <LikeComponent
              episodeOrCommentId={episode.id}
              initialLikes={episode.likes}
            />
            <CommentComponent
              episodeIdOrCommentId={episode.id}
              initialComments={episode.comments.length}
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
