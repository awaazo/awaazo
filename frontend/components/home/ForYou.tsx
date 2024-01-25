import React, { useState, useEffect } from "react";
import { Box, Text, SimpleGrid, Spinner } from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../cards/PodcastCard";

const ForYou: React.FC = () => {
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

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={5}>
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No podcasts available</Text>
      )}
    </Box>
  );
};

export default ForYou;
