import React, { useState, useEffect } from 'react';
import { Box, Button, Collapse, Image, Text, useDisclosure } from '@chakra-ui/react';
import { usePlayer } from '../../utilities/PlayerContext';
import { FaPlay } from 'react-icons/fa';

// Update the CueInfo type to include the 'content' property
type CueInfo = {
  timestamp: number;
  content: string; // Add content property
  type: 'general' | 'mediaLink' | 'sponsor';
  referenceUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type PodCueProps = {
  cues: CueInfo[];
};

const PodCue: React.FC<PodCueProps> = ({ cues }) => {
  const { state: { episode }, audioRef } = usePlayer();
  const [activeCue, setActiveCue] = useState<CueInfo | null>(null);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const checkForActiveCue = () => {
      const currentTime = audioRef.current?.currentTime || 0;
      const active = cues.find(cue => currentTime >= cue.timestamp);
      setActiveCue(active || null);
    };

    const interval = setInterval(checkForActiveCue, 1000);
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
      case 'general':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Text fontSize="sm">{cue.content}</Text>
          </Box>
        );
      case 'mediaLink':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Image src={cue.imageUrl} alt="Media thumbnail" />
            <Text fontSize="sm">{cue.content}</Text>
            <Button as="a" href={cue.videoUrl} leftIcon={<FaPlay />} variant="solid">
              Watch
            </Button>
          </Box>
        );
      case 'sponsor':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Text fontSize="sm">{cue.content}</Text>
            <Button as="a" href={cue.referenceUrl} variant="outline" colorScheme="teal">
              Visit Sponsor
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
