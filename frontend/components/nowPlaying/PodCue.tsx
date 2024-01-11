import React, { useState, useEffect } from 'react';
import { Box, Button, Collapse, Image, Text, useDisclosure } from '@chakra-ui/react';
import { usePlayer } from '../../utilities/PlayerContext';
import { FaPlay } from 'react-icons/fa';

// Update the CueInfo type to include the new fields
type CueInfo = {
  timestamp: number;
  content: string;
  type: 'Info' | 'Media Link' | 'Sponsorship';
  mediaLink?: {
    url: string;
    platform: string;
  };
  sponsor?: {
    name: string;
    website: string;
  };
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
      case 'Info':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Text fontSize="sm">{cue.content}</Text>
          </Box>
        );
      case 'Media Link':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            {cue.mediaLink?.url && (
              <>
                <Image src={cue.mediaLink.url} alt="Media thumbnail" />
                <Text fontSize="sm">{cue.content}</Text>
                <Button as="a" href={cue.mediaLink.url} leftIcon={<FaPlay />} variant="solid">
                  Watch
                </Button>
              </>
            )}
          </Box>
        );
      case 'Sponsorship':
        return (
          <Box p={4} bg="gray.700" color="white" rounded="md" shadow="md">
            <Text fontSize="sm">{cue.content}</Text>
            {cue.sponsor?.website && (
              <Button as="a" href={cue.sponsor.website} variant="outline" colorScheme="teal">
                Visit Sponsor
              </Button>
            )}
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
