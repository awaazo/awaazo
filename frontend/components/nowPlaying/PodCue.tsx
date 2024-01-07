import React, { useState, useEffect } from 'react';
import { Box, Button, Collapse, Image, Text, useDisclosure } from '@chakra-ui/react';
import { convertTime } from '../../utilities/commonUtils';
import { usePlayer } from '../../utilities/PlayerContext';
import { FaPlay } from 'react-icons/fa';

type CueInfo = {
  startTime: number;
  endTime: number;
  content: string;
  type: 'definition' | 'video' | 'ad';
  referenceUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type PodCueProps = {
  cues: CueInfo[];
};

const PodCue: React.FC<PodCueProps> = ({ cues }) => {
  const { state: { episode, currentEpisodeIndex }, audioRef } = usePlayer();
  const [activeCue, setActiveCue] = useState<CueInfo | null>(null);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const checkForActiveCue = () => {
      const currentTime = audioRef.current?.currentTime || 0;
      const active = cues.find(cue =>
        currentTime >= cue.startTime && currentTime <= cue.endTime
      );
      setActiveCue(active || null);
    };

    const interval = setInterval(checkForActiveCue, 1000); // check every second
    return () => clearInterval(interval);
  }, [cues, audioRef]);

  useEffect(() => {
    if (activeCue && !isOpen) {
      onToggle();
    } else if (!activeCue && isOpen) {
      onToggle();
    }
  }, [activeCue, isOpen, onToggle]);

  const renderCueContent = (cue: CueInfo) => {
    switch (cue.type) {
      case 'definition':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Text fontSize="sm">{cue.content}</Text>
            <Button as="a" href={cue.referenceUrl} variant="link" color="teal.200">
              Read More
            </Button>
          </Box>
        );
      case 'video':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Image src={cue.imageUrl} alt="Video thumbnail" />
            <Button as="a" href={cue.videoUrl} leftIcon={<FaPlay />} variant="solid">
              Watch Video
            </Button>
          </Box>
        );
      case 'ad':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Image src={cue.imageUrl} alt="Advertisement" />
            <Text fontSize="sm">{cue.content}</Text>
            <Button as="a" href={cue.referenceUrl} variant="outline" colorScheme="teal">
              Shop Now
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Collapse in={isOpen} animateOpacity>
      {activeCue && renderCueContent(activeCue)}
    </Collapse>
  );
};


export default PodCue;
