import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  VStack,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";

import { PodcastByTagsRequest } from "../../../utilities/Requests";
import { Podcast } from "../../../utilities/Interfaces";
import { useRouter } from "next/router";

import Navbar from "../../../components/shared/Navbar";
import PodcastHelper from "../../../helpers/PodcastHelper";
import PodcastCard from "../../../components/explore/PodcastCard";
import ExploreGenresSection from "../../../components/home/ExploreGenres";
import PlayerBar from "../../../components/shared/PlayerBar";

export default function MyPodcast() {
  const router = useRouter();
  const path = router.asPath;
  const genreName = path.split("/").pop();
  router.query;

  const genreNameArray = [genreName];

  // Set initial state and loading state
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(12);
  const [getError, setGetError] = useState("");

  useEffect(() => {
    if (genreName == "[genre]") {
      return;
    } else {
      const data: PodcastByTagsRequest = {
        tags: genreNameArray,
      };
      PodcastHelper.podcastByTagsPodcastsGet(index1, index2, data)
        .then((res) => {
          if (res.status == 200) {
            setPodcasts(res.podcasts);
          } else {
            setGetError("Podcasts cannot be fetched");
          }
        })
        .finally(() => {
          // Set loading to false once the data is fetched (or an error occurred)
          setLoading(false);
        });
    }
  }, [genreName, index1, index2]);

  const columns = useBreakpointValue({ base: 2, md: 3, lg: 6 });

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        px={["1em", "2em", "4em"]}
        height="calc(100vh - 60px - 80px)"
      >
        <ExploreGenresSection />
        <Box
          bgGradient="linear(to-r, #6a39c4, transparent)"
          w={{ base: "70%", md: "30%" }}
          borderRadius="0.5em"
          boxShadow="lg"
          p="8px"
        >
          {!loading && (
            <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
              Podcasts labeled "{genreName}"
            </Text>
          )}
        </Box>

        {loading ? (
          // Show loading indicator or spinner
          <></>
        ) : podcasts && podcasts.length > 0 ? (
          <SimpleGrid columns={columns} spacing={7} marginTop={"2em"}>
            {podcasts.map((podcast, index) => (
              <PodcastCard key={index} podcast={podcast} />
            ))}
          </SimpleGrid>
        ) : (
          // Show error message
          <Text style={{ marginTop: "50px", marginLeft: "30px" }}>
            (No podcasts available)
          </Text>
        )}

        {/* Player Bar */}
      </Box>
    </>
  );
}
