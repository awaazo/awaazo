import React, { useState, useEffect } from 'react';
import { Box, Link, Image, AspectRatio, Text, Flex, Heading, Spacer, IconButton } from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { usePlayer } from '../../utilities/PlayerContext';

interface Annotation {
  id: string;
  timestamp: number;
  content: string;
  annotationType: 'Media Link' | 'Info' | 'Sponsership' | 'media-link'; // Adjusted type name
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
      console.log('Current Time:', currentTime);
      const annotationsToShow = cues.filter(ann => currentTime >= ann.timestamp && currentTime < ann.timestamp + 10);
      console.log('Cues to Show:', annotationsToShow);
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
      <Flex
        direction="column"
        align="start"
        p={5}
        m={4}
        bg="gray.700"
        borderRadius="2xl"
        boxShadow="2xl"
        width={["95%", "sm"]}
        maxW="sm"
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Flex direction="row" align="center" mb={3}>
          <Heading as="h3" size="md" fontWeight="bold" mr={2} isTruncated>
            {title}
          </Heading>
          <Spacer />
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
        <Box>
          {annotationContent}
        </Box>
      </Flex>
    );
  };

  if (!currentAnnotations.length) {
    return null;
  }

  return (
    <Flex position="absolute" right="4" p="4" zIndex="10" justifyContent="center" flexDirection="column">
      {currentAnnotations.map(annotation => renderAnnotationContent(annotation))}
    </Flex>
  );
};

export default PodCue;
