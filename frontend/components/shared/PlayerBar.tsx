import React, { useState } from 'react';
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
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaCommentAlt,
  FaBackward,
  FaForward,
  FaVolumeDown,
  FaVolumeUp,
} from 'react-icons/fa';
import { Episode } from '../../utilities/Interfaces';

function PlayerBar(props) {
  const {
    coverArt,
    episodeName = 'Unknown Episode',
    podcaster = 'Unknown Podcaster',
    duration,
    likes,
    comments,
    sections = [],
  } = props;

  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(likes.isLiked);
  const [volume, setVolume] = useState(30); // Assuming a default volume level

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleLike = () => setIsLiked(!isLiked);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const currentTime = formatTime(position);
  const timeLeft = formatTime(duration - position);

  const likedColor = useColorModeValue('gray.900', 'gray.100');
  const commentedColor = useColorModeValue('gray.900', 'gray.100');

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
      bg={useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)')}
      shadow="md"
      style={{ backdropFilter: 'blur(50px)' }}
      border="3px solid rgba(255, 255, 255, 0.05)"
      boxShadow="0px 0px 15px rgba(0, 0, 0, 0.4)"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Episode Info */}
        <Flex alignItems="center" onClick={() => console.log('Navigating to player page...')} cursor="pointer">
          <Image boxSize={isMobile ? '30px' : '40px'} src={coverArt} borderRadius="full" mr={4} />
          <Box>
            <Text fontWeight="bold" fontSize={isMobile ? 'sm' : 'md'} color={useColorModeValue('gray.900', 'gray.100')}>
              {episodeName}
            </Text>
            <Text fontSize={isMobile ? 'xs' : 'sm'} color="gray.500">
              {podcaster}
            </Text>
          </Box>
        </Flex>

        {/* Player Controls */}
        <Flex alignItems="center">
          <IconButton aria-label="Rewind" icon={<FaBackward />} variant="ghost" size="sm" onClick={() => setPosition((prev) => Math.max(prev - 10, 0))} mr={2} />
          <IconButton
            aria-label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            mr={2}
          />
          <IconButton aria-label="Fast Forward" icon={<FaForward />} variant="ghost" size="sm" onClick={() => setPosition((prev) => Math.min(prev + 10, duration))} />
        </Flex>

 {/* Slider - Hidden in mobile */}
        {!isMobile && (
          <Flex width="50%" mx={4} alignItems="center">
            <Text mr={2}>{currentTime}</Text>
            <Slider aria-label="Track Timeline" value={position} max={duration} onChange={(val) => setPosition(val)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text ml={2}>{timeLeft}</Text>
          </Flex>
        )}

        {/* Like and Comment - Hidden in mobile */}
        {!isMobile && (
          <Flex alignItems="center">
            <IconButton aria-label="Like" icon={<FaHeart />} variant="ghost" size="sm" color={isLiked ? 'red.500' : likedColor} onClick={toggleLike} />
            <IconButton aria-label="Comment" icon={<FaCommentAlt />} variant="ghost" size="sm" color={comments.isCommented ? 'blue.500' : commentedColor} onClick={() => console.log('Navigating to comments...')} />
          </Flex>
        )}
        
        {/* Volume Control - Hidden in mobile */}
        {!isMobile && (
          <Flex alignItems="center" ml={4} width={"10%"}>
            <IconButton aria-label="Volume Down" icon={<FaVolumeDown />} variant="ghost" size="sm" onClick={() => setVolume(Math.max(volume - 10, 0))} />
            <Slider aria-label="Volume" value={volume} onChange={setVolume} mx={2}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <IconButton aria-label="Volume Up" icon={<FaVolumeUp />} variant="ghost" size="sm" onClick={() => setVolume(Math.min(volume + 10, 100))} />
          </Flex>
        )}

      </Flex>
    </Box>
  );
}

export default PlayerBar;




