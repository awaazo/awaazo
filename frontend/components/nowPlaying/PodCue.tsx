import React, { useState, useEffect } from 'react';
import { Box, Link, Image, AspectRatio, Text } from '@chakra-ui/react';
import { usePlayer } from '../../utilities/PlayerContext';

interface Annotation {
  id: string;
  timestamp: number;
  content: string;
  type: 'Media Link' | 'Info' | 'Sponsership' | 'media-link';
  sponsorship?: {
    name: string;
    website: string;
  };
  mediaLink?: {
    url: string;
    platform: string;
  };
}

interface PodCueProps {
  cues: Annotation[];
}

const PodCue: React.FC<PodCueProps> = ({ cues }) => {
  // console.log("Check Cues",cues);
  const { state: { episode }, audioRef } = usePlayer();
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);

  useEffect(() => {
    const checkAnnotations = () => {
      const currentTime = audioRef.current?.currentTime ?? 0;
      // console.log('Current Time:', currentTime);
      const annotationToShow = cues.find(ann => currentTime >= ann.timestamp && currentTime < ann.timestamp + 10);
      // console.log('Cue to Show:', annotationToShow); 
      setCurrentAnnotation(annotationToShow);
    };

    // Set up interval to check for annotations every second
    const intervalId = setInterval(checkAnnotations, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cues, audioRef]);

  const renderAnnotationContent = (annotation: Annotation) => {
    switch (annotation.type) {
      case 'Media Link':
        return <Link href={annotation.sponsorship?.website} isExternal>{annotation.content}</Link>;
      case 'Info':
        return <Text>{annotation.content}</Text>;
      case 'Sponsership':
        return annotation.sponsorship ? (
          <Link href={annotation.sponsorship.website} isExternal>
            <Image src={annotation.content} alt={annotation.sponsorship.name} />
          </Link>
        ) : null;
      case 'Media Link':
        return annotation.mediaLink ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              title='Media Content'
              src={annotation.mediaLink.url}
              allowFullScreen
            />
          </AspectRatio>
        ) : null;
      default:
        return null;
    }
  };

  if (!currentAnnotation) return null;

  return (
    <Box position='absolute' bottom='0' left='0' right='0' p='4' bg='gray.900' color='white'>
      {renderAnnotationContent(currentAnnotation)}
    </Box>
  );
};

export default PodCue;
