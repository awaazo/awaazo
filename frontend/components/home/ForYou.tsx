import React, { useState, useEffect } from "react";
import { SimpleGrid, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../explore/PodcastCard";

// Component to display recommended podcasts
const ForYou: React.FC = () => {
  useEffect(() => {
    // Fetch recommended podcasts from the server
    PodcastHelper.podcastAllPodcastsGet(0, 12).then((res) => {
      // If the request is successful, set the podcasts state
      if (res.status == 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts(null);
      }
    });
  }, []);

  // Determine the number of columns based on the screen size
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 6 });
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  return (
    <>
      {/* Background gradient */}
      <Box
        bgGradient="linear(to-r, #6a39c4, transparent)"
        w={{ base: "70%", md: "20%" }}
        top={0}
        left={0}
        zIndex={-99}
        borderRadius={"0.5em"}
        boxShadow={"lg"}
      >
        {/* Title */}
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Podcasts For You
        </Text>
      </Box>
      {/* Grid to display the recommended podcasts */}
      <SimpleGrid columns={columns} spacing={7} marginBottom={"4em"}>
        {/* Check if there are podcasts available */}
        {podcasts && podcasts.length > 0 ? (
          // Map through the podcasts and render a PodcastCard for each one
          podcasts.map((podcast, index) => (
            <PodcastCard
              key={index}
              podcast={podcast}
              data-cy={`podcast-card-${index}`} // Unique data-cy attribute for each PodcastCard
            />
          ))
        ) : (
          // Display a message if no podcasts are available
          <Text
            style={{
              marginTop: "50px",
              marginBottom: "50px",
              marginLeft: "35px",
            }}
          >
            (No podcasts available)
          </Text>
        )}
      </SimpleGrid>
    </>
  );
};

export default ForYou;
