import React, { useState, useEffect } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../cards/PodcastCard";

const ForYou: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    PodcastHelper.podcastAllPodcastsGet(0, 12).then((res) => {
      if (res.status === 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts([]);
      }
    });
  }, []);

  return (
<Box>
  {podcasts && podcasts.length > 0 ? (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} >
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
