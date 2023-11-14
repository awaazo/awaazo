import React, { useState, useEffect } from "react";
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  useBreakpointValue,
  Card,
  Flex,
  Link,
} from "@chakra-ui/react";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../explore/PodcastCard";

const ForYou: React.FC = () => {
  useEffect(() => {
    PodcastHelper.podcastAllPodcastsGet(0, 12).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts(null);
      }
    });
  }, []);

  const columns = useBreakpointValue({ base: 2, md: 3, lg: 6 });
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  return (
    <>
      <Box
        bgGradient="linear(to-r, #6a39c4, transparent)"
        w={{ base: "70%", md: "20%" }}
        top={0}
        left={0}
        zIndex={-99}
        borderRadius={"0.5em"}
        boxShadow={"lg"}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Podcasts For You
        </Text>
      </Box>
      <SimpleGrid columns={columns} spacing={7} marginBottom={"4em"}>
        {podcasts ? (
          podcasts.map((podcast, index) => (
            <PodcastCard key={index} podcast={podcast} />
          ))
        ) : (
          <Text style={{ marginTop: "50px", marginLeft: "30px" }}>
            (No podcasts available)
          </Text>
        )}
      </SimpleGrid>
    </>
  );
};

export default ForYou;
