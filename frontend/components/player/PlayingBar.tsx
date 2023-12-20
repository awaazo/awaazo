import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import PlayingHelper from '../../helpers/PlayingHelper';
import { MdMoreVert } from "react-icons/md";

const PlayComponent = ({ podcastId, episodeId }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
   const fetchAudio = async () => {
     setIsLoading(true);
     try {
       const audioUrl = await PlayingHelper.getEpisodePlaying(podcastId, episodeId);
       setAudioUrl(audioUrl);
     } catch (error) {
       console.error('Error fetching episode:', error);
     }
     setIsLoading(false);
   };
 
   fetchAudio();
 }, [podcastId, episodeId]);
 

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

  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted]);

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
 
   audio.addEventListener('loadedmetadata', setAudioData);
 
   return () => {
     audio.removeEventListener('loadedmetadata', setAudioData);
   };
 }, []);
 
 useEffect(() => {
   const audio = audioRef.current;
 
   const updateTime = () => {
     setCurrentTime(audio.currentTime);
   };
 
   audio.addEventListener('timeupdate', updateTime);
 
   return () => {
     audio.removeEventListener('timeupdate', updateTime);
   };
 }, []);

 useEffect(() => {
   audioRef.current.playbackRate = playbackSpeed;
 }, [playbackSpeed]);
 

   // Function to format time in mm:ss format
   const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
 
 const handleSeek = (event) => {
   const seekTime = Number(event.target.value);
   audioRef.current.currentTime = seekTime;
   setCurrentTime(seekTime);
 };
 const handleDownload = () => {
   const link = document.createElement("a");
   link.href = audioUrl;
   link.download = `downloaded_audio.mp3`; // You can dynamically set the filename
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 };
 
 
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
   <Box p={2} m={3} bg="gray.500" borderRadius="lg" boxShadow="md" width="full">
     {audioUrl ? (
       <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
         <IconButton
           icon={isPlaying ? <FaPause /> : <FaPlay />}
           onClick={togglePlayPause}
           aria-label={isPlaying ? 'Pause' : 'Play'}
           size="md"
           colorScheme="blue"
           mr={2}
           borderRadius="full"
         />
         <Box flex="1" mx={2}>
           <input
             type="range"
             min={0}
             max={duration}
             value={currentTime}
             onChange={handleSeek}
             style={{ width: '100%' }}
           />
         </Box>
         <IconButton
           icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
           onClick={toggleMute}
           aria-label={isMuted ? 'Unmute' : 'Mute'}
           size="md"
           colorScheme="blue"
           borderRadius="full"
           mr={2}
         />
         <Menu>
         <MenuButton as={IconButton} icon={<MdMoreVert />} size="md" colorScheme="blue" borderRadius="full" mr={2} />
         <MenuList>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(0.25)}>0.25x</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(0.5)}>0.5x</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(0.75)}>0.75x</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(1)}>Normal</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(1.25)}>1.25x</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(1.5)}>1.5x</MenuItem>
            <MenuItem onClick={() => setPlaybackSpeed(2)}>2x</MenuItem>
         </MenuList>
         </Menu>

         <Text color="white" mt={2}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
       </Box>
     ) : (
       <Box textAlign="center" p={3} color="red.500" borderRadius="lg">
         Unable to load audio
       </Box>
     )}
   </Box>
 );
  
};

export default PlayComponent;
