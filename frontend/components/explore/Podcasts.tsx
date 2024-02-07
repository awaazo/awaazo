import React, { useState, useEffect } from "react";
import { SimpleGrid, Box, Image, Text, useBreakpointValue, Card, Flex } from "@chakra-ui/react";
import { Podcast } from "../../types/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import Link from "next/link";

// Component for rendering a podcast card
const PodcastCard = ({ podcast }) => (
  <Link href={`/Explore/${podcast.id}`} passHref>
    <Card
      boxShadow="lg"
      rounded="md"
      overflow="hidden"
      background={"transparent"}
      _hover={{
        transform: "scale(1.07)",
        textDecoration: "none",
      }}
      height={"100%"}
      position="relative"
      outline="solid 3px rgba(255, 255, 255, 0.15)"
      borderRadius="1.5em"
      transition="all 0.4s ease-in-out"
    >
      {/* Background layer */}
      <Box position="absolute" top="0" right="0" bottom="0" left="0" zIndex={-1} borderRadius="1.2em">
        {/* Dark opacity layer */}
        <Box position="absolute" top="0" right="0" bottom="0" left="0" zIndex={99} backgroundColor="rgba(0, 0, 0, 0.4)" borderRadius="inherit" />
        <Box position="absolute" top="0" right="0" bottom="0" left="0" background={podcast.coverArtUrl} backgroundSize="cover" backgroundPosition="center" filter="blur(20px)" borderRadius="inherit" />
      </Box>
      <Image
        src={podcast.coverArtUrl}
        alt={podcast.title}
        height={{
          base: "150px",
          md: "200px",
          lg: "200px",
        }}
        objectFit={"cover"}
      />
      <Flex direction="column" align="center" p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {podcast.name}
        </Text>
        <Text fontSize="sm" textAlign="center" opacity={"0.6"}>
          {podcast.description.length <= 50 ? podcast.description : podcast.description.slice(0, 50) + "..."}
        </Text>
      </Flex>
      {/* button */}
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, 50%)" zIndex={999}></Box>
    </Card>
  </Link>
);

// Component for rendering the "For You" section
const ForYou: React.FC = () => {
  useEffect(() => {
    PodcastHelper.podcastAllPodcastsGet(0, 20).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts(null);
      }
    });
  });

  const columns = useBreakpointValue({ base: 2, md: 3, lg: 6 });
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  return (
    <>
      <Box bgGradient="linear(to-r, #6a39c4, transparent)" w={{ base: "70%", md: "20%" }} top={0} left={0} zIndex={-99} borderRadius={"0.5em"} boxShadow={"lg"}>
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Podcasts For You
        </Text>
      </Box>
      <SimpleGrid columns={columns} spacing={7} marginBottom={"4em"}>
        {podcasts ? podcasts.map((podcast, index) => <PodcastCard key={index} podcast={podcast} />) : <Text>No podcasts available</Text>}
      </SimpleGrid>
    </>
  );
};

export default ForYou;
