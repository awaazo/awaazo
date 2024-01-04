import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { Podcast } from '../../utilities/Interfaces';
import PodcastHelper from '../../helpers/PodcastHelper';
import PodcastCard from '../cards/PodcastCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const ForYou: React.FC = () => {
  useEffect(() => {
    PodcastHelper.podcastAllPodcastsGet(0, 12).then((res) => {
      if (res.status === 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts([]);
      }
    });
  }, []);

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollCards = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.7;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      setScrollIndex(container.scrollLeft);
    }
  };

  return (
    <VStack spacing={2} align="stretch">
      <HStack spacing={isMobile ? 4 : 6} overflowX="auto" ref={scrollContainerRef}>
        {podcasts && podcasts.length > 0 ? (
          podcasts.map((podcast) => <PodcastCard key={podcast.id} podcast={podcast} />)
        ) : (
          <Text>No podcasts available</Text>
        )}
      </HStack>

      {isMobile && (
        <HStack justifyContent="space-between" width="full" paddingX="2">
          <IconButton
            aria-label="Scroll Left"
            icon={<ChevronLeftIcon />}
            onClick={() => scrollCards('left')}
            isDisabled={scrollIndex <= 0}
          />
          <IconButton
            aria-label="Scroll Right"
            icon={<ChevronRightIcon />}
            onClick={() => scrollCards('right')}
            isDisabled={scrollIndex + scrollContainerRef.current?.offsetWidth >= scrollContainerRef.current?.scrollWidth}
          />
        </HStack>
      )}
    </VStack>
  );
};

export default ForYou;
