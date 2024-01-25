import React, { useState, useEffect } from "react";
import { Box, VStack, Text, HStack, useBreakpointValue, Spinner } from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastTicket from "./PodcastTicket";

const RecentlyUploaded: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const res = await PodcastHelper.podcastAllPodcastsGet(0, 12);
        if (res.status === 200) {
          setPodcasts(res.podcasts);
        } else {
          throw new Error('Failed to load podcasts');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching podcasts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <VStack spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <HStack
          spacing={4}
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {podcasts && podcasts.length > 0 ? (
            podcasts.map((podcast) => podcast.episodes.map((episode) => <PodcastTicket key={episode.id} episode={episode} />))
          ) : (
            <Text>No episodes available</Text>
          )}
        </HStack>
      )}
    </VStack>
  );
};

export default RecentlyUploaded;
