import React, { useState, useEffect } from 'react';
import { Box, Link, Image, AspectRatio, Text, Flex, IconButton, VStack } from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { usePlayer } from '../../utilities/PlayerContext';

interface Annotation {
  id: string;
  timestamp: number;
  content: string;
  annotationType: 'Media Link' | 'Info' | 'Sponsership' | 'media-link';
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
  const { state: { episode }, audioRef } = usePlayer();
  const [currentAnnotations, setCurrentAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    const checkAnnotations = () => {
      const currentTime = audioRef.current?.currentTime ?? 0;
      const annotationsToShow = cues.filter(ann => currentTime >= ann.timestamp && currentTime < ann.timestamp + 10);
      setCurrentAnnotations(annotationsToShow);
    };

    const intervalId = setInterval(checkAnnotations, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cues, audioRef]);

  const renderAnnotationContent = (annotation: Annotation) => {
    let annotationContent;
    let title;
    let icon;

    switch (annotation.annotationType) {
      case 'Media Link':
        title = "Watch Video";
        icon = <FaExternalLinkAlt />;
        annotationContent = (
          <AspectRatio ratio={16 / 9} width="full">
            <iframe
              title='Media Content'
              src={annotation.mediaLink?.url}
              allowFullScreen
            />
          </AspectRatio>
        );
        break;
      case 'Info':
        title = "Learn More";
        icon = <FaExternalLinkAlt />;
        annotationContent = <Text>{annotation.content}</Text>;
        break;
      case 'Sponsership':
        title = "Sponsored";
        icon = <FaExternalLinkAlt />;
        annotationContent = (
          <Image
            src={annotation.content}
            alt={annotation.sponsorship?.name}
            objectFit="contain"
            htmlWidth="100%"
          />
        );
        break;
      default:
        annotationContent = null;
    }

    return annotationContent && (
      <Box
        bg="rgba(255, 255, 255, 0.02)"
        borderRadius="2xl"
        p={4}
        _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
        w="100%"
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="md" color="white">
            {title}
          </Text>
          {annotation.mediaLink && (
            <Link href={annotation.mediaLink.url} isExternal>
              <IconButton
                aria-label="External Link"
                icon={icon}
                size="md"
                variant="outline"
                colorScheme="teal"
                _hover={{ bg: 'teal.600', color: 'white' }}
              />
            </Link>
          )}
        </Flex>
        <Box p={4} borderRadius="md">
          {annotationContent}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      border="3px solid rgba(255, 255, 255, 0.05)"
      width="100%"
      height="100%"
      maxH="300px" // Fixed height
      p={2}
      borderRadius="1.1em"
      overflowY="auto" // Scroll option
    >
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Text fontSize="md" fontWeight="bold" ml={2} color="white">
          Annotations
        </Text>
      </Flex>
      <VStack spacing={3} align="start" mb={4}>
        {currentAnnotations.length ? (
          currentAnnotations.map(annotation => renderAnnotationContent(annotation))
        ) : (
          <Text color="white" p={4}>No annotations at this time.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default PodCue;