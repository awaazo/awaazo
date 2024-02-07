import React, { useState, useEffect } from "react";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Episode } from "../../types/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";

interface CoverArtProps {
  episodeId: string;
}

const CoverArt: React.FC<CoverArtProps> = ({ episodeId }) => {
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (episodeId) {
      PodcastHelper.getEpisodeById(episodeId)
        .then((response) => {
          if (response.status === 200 && response.episode) {
            setEpisode(response.episode);
          } else {
            console.error("Error fetching episode data:", response.message);
          }
        })
        .catch((error) => console.error("Error fetching episode data:", error));
    }
  }, [episodeId]);

  
  return (
    <Box w="full" h="full" p="4" position="relative" overflow="hidden" rounded="2xl">
      {episode && (
        <>
          <Image src={episode.thumbnailUrl} alt="Episode Cover Art" position="absolute" top={0} left={0} w="full" h="full" objectFit="cover" />

          <Box position="absolute" bottom={0} left={0} w="full" bgGradient="linear(to-t, rgba(0,0,0,0.8), rgba(0,0,0,0))" p="4" zIndex={2}>
            <VStack alignItems="start" spacing={4} justifyContent="center" py="8">
              <Text color="white" fontSize="xl" fontWeight="bold" pb="1">
                About This Episode:
              </Text>
              <Text color="white" maxW="100%" noOfLines={6}>
                {episode.description}
              </Text>
            </VStack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CoverArt;
