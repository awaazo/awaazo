import React, { useState, useEffect } from 'react';
import { Box, Text, Link, useDisclosure, Collapse } from '@chakra-ui/react';

type CueInfo = {
  startTime: number; 
  endTime: number; 
  content: string;
  referenceUrl?: string;
};

type PodCueProps = {
  currentPlaybackTime: number;
  cues: CueInfo[];
};

const PodCue: React.FC<PodCueProps> = ({ currentPlaybackTime, cues }) => {
  const [activeCue, setActiveCue] = useState<CueInfo | null>(null);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const active = cues.find(cue =>
      currentPlaybackTime >= cue.startTime && currentPlaybackTime <= cue.endTime
    );
    setActiveCue(active || null);
    if (active && !isOpen) {
      onToggle();
    } else if (!active && isOpen) {
      onToggle();
    }
  }, [currentPlaybackTime, cues, isOpen, onToggle]);

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box p={4} bg="blue.500" color="white" rounded="md" shadow="md">
        <Text fontSize="sm">{activeCue?.content}</Text>
        {activeCue?.referenceUrl && (
          <Link href={activeCue.referenceUrl} color="teal.200" isExternal>
            Reference
          </Link>
        )}
      </Box>
    </Collapse>
  );
};

export default PodCue;
