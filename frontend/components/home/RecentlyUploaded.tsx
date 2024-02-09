import React, { useState, useEffect } from "react";
import { Episode } from "../../types/Interfaces";
import { VStack, Text, HStack, useBreakpointValue, Spinner, SimpleGrid } from "@chakra-ui/react";
import { Podcast } from "../../types/Interfaces";

import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastTicket from "./PodcastTicket";

const RecentlyUploaded: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const res = await PodcastHelper.podcastGetRecentEpisodes(0, 12);
        if (res.status === 200) {
          setEpisodes(res.episode);
        } else {
          throw new Error("Failed to load podcasts");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching podcasts");
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
          <SimpleGrid columns={{ base: 3, sm: 4, md: 5, lg: 6, xl: 7 }} spacing={5}>
            {podcasts && podcasts.length > 0 ? podcasts.map((podcast) => podcast.episodes.map((episode) => <PodcastTicket key={episode.id} episode={episode} />)) : <Text>No episodes available</Text>}
          </SimpleGrid>
        </HStack>
      )}
    </VStack>
  );
};

export default RecentlyUploaded;
