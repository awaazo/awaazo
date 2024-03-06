import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, Menu, MenuButton, MenuList, MenuItem, Tooltip, Icon, Button, HStack } from "@chakra-ui/react";
import { FaPlay, FaPause} from "react-icons/fa";
import EndpointHelper from "../../helpers/EndpointHelper";
import { convertTime } from "../../utilities/commonUtils";
import { TbKeyframeFilled } from "react-icons/tb";

const TranscriptPlayingBar = ({ podcastId, episodeId }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [endBookmarkPosition, setEndBookmarkPosition] = useState(0);

  // Function to fetch episode URL
  const getEpisodePlaying = async (podcastId, episodeId) => {
    return EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId);
  };

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const audioUrl = await getEpisodePlaying(podcastId, episodeId);
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
      setIsLoading(false);
    };

    fetchAudio();
  }, [podcastId, episodeId]);

//   useEffect(() => {
//     const lastSectionEndTime = sections?.length > 0 ? sections[sections.length - 1].end : 0;
//     setEndBookmarkPosition((lastSectionEndTime / duration) * 100);
//     setCurrentTime(isAdding ? lastSectionEndTime : 0);
//     audioRef.current.currentTime = isAdding ? lastSectionEndTime : 0;
//   }, [isAdding, sections]);

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


  const handleSeek = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // Handles displaying teh section title
  const [showSectionTitle, setShowSectionTitle] = useState(false);

  const handleMouseEnter = () => {
    setShowSectionTitle(true);
  };

  const handleMouseLeave = () => {
    setShowSectionTitle(false);
  };

//   // Handles End Changes
//   const handleEndChange = () => {
//     const lastSectionEndTime = sections.length > 0 ? sections[sections.length - 1].end : 0;
//     if (currentTime > lastSectionEndTime) {
//       onEndChange(currentTime);
//       setEndBookmarkPosition((currentTime / duration) * 100);
//     } else {
//       console.log("End time must be after the end of the last section");
//     }
//   };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={2} m={3} borderRadius="2xl" boxShadow="md" width="150%" position="relative">
      {audioUrl ? (
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <IconButton icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"} size="md" variant="ghost" mr={2} borderRadius="full" data-cy={`sections-play-pause`}/>
          <Box flex="1" mx={5} mt={1} textAlign="center">
            <Slider
              min={0}
              max={duration}
              value={currentTime}
              minWidth={"100px"}
              onChange={(value) => handleSeek(value)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <SliderTrack>
                <SliderFilledTrack bg="brand.100" />
              </SliderTrack>

              <SliderThumb boxSize={2} />
             
            </Slider>
          </Box>

          <Text color="white" mt={0.5}>
            {convertTime(currentTime)} / {convertTime(duration)}
          </Text>
          <Box position="absolute" top="-40px" left="50%" transform="translateX(-50%)" textAlign="center"></Box>
        </Box>
      ) : (
        <Box textAlign="center" p={3} color="red.500" borderRadius="lg">
          Unable to load audio
        </Box>
      )}
    </Box>
  );
};

export default TranscriptPlayingBar;
