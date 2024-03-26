import React, { useState, useEffect } from "react";
import { Box, Text, Spinner, Flex, VStack, HStack } from "@chakra-ui/react";
import { Podcast } from "../../types/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../cards/PodcastCard";
import EpisodesForYou from "./EpisodesForYou";
import Snippets from "./Snippets";
import TodaysRecommendation from "./TodaysRecommendation";

const ForYou: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const res = await PodcastHelper.podcastGetRecentPodcasts(0, 12);
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

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <>
          <Text fontSize="2xl" fontWeight="bold" mt={4}>Podcasts</Text>
          <Flex flexWrap="wrap">
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </Flex>
          <Flex width="100%" alignItems="flex-start">
            <HStack width="40%">
              <VStack align="left">
                <Text fontSize="2xl" fontWeight="bold" mt={4}>Episodes For You</Text>
                <EpisodesForYou />
              </VStack>
            </HStack>
            <VStack width="60%" alignItems="flex-start">
              <VStack align="left">
                <Text fontSize="2xl" fontWeight="bold" mt={4}>Snippets</Text>
                <Snippets />
              </VStack>
              <VStack align={"left"}>
                <Text fontSize="2xl" fontWeight="bold" mt={4}>Today's Recommendation</Text>
                <TodaysRecommendation />
              </VStack>
            </VStack>
          </Flex>
        </>
      ) : (
        <Text>No podcasts available</Text>
      )}
    </Box>
  );
};

export default ForYou;
