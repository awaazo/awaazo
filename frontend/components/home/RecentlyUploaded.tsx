import React, { useState, useEffect } from "react";
import { Box, VStack, Text, HStack, useBreakpointValue } from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastTicket from "./PodcastTicket";

// Component to display recently uploaded podcasts
const RecentlyUploaded: React.FC = () => {
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

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <VStack spacing={4} align="stretch">
      <HStack
        spacing={4}
        overflowX="auto"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {podcasts && podcasts.length > 0 ? podcasts.map((podcast) => podcast.episodes.map((episode) => <PodcastTicket key={episode.id} episode={episode} />)) : <Text>No episodes available</Text>}
      </HStack>
    </VStack>
  );
};

export default RecentlyUploaded;
