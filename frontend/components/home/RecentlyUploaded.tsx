import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  useBreakpointValue,
  Spinner,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastTicket from "./PodcastTicket";

const RecentlyUploaded: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const res = await PodcastHelper.podcastAllPodcastsGet(0, 12);
        if (res.status === 200) {
          setPodcasts(res.podcasts);
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
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <Flex flexWrap="wrap">
          {podcasts.map((podcast) =>
            podcast.episodes.map((episode) => (
              <PodcastTicket key={episode.id} episode={episode} />
            )),
          )}
        </Flex>
      ) : (
        <Text>No episodes available</Text>
      )}
    </Box>
  );
};

export default RecentlyUploaded;
