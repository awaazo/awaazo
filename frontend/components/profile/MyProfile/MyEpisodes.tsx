import React, { useEffect, useState } from "react";
import {
  Box,
  Tag,
  Avatar,
  HStack,
  Flex,
  Tooltip,
  Text,
  Icon,
  Link,
  IconButton,
  useColorModeValue,
  Stack,
  Button,
  VStack,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { Podcast, Episode } from "../../../utilities/Interfaces";
import PodcastHelper from "../../../helpers/PodcastHelper";
import { usePlayer } from "../../../utilities/PlayerContext";

// Define the MyEpisodes component
export default function MyEpisodes() {
  const { dispatch } = usePlayer();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [rangeEpisodes, setRangeEpisodes] = useState<Episode[]>([]);
  const [range, setRange] = useState(0);

  useEffect(() => {
    // Check to make sure the user has logged in

    PodcastHelper.podcastMyPodcastsGet(page, pageSize).then((res2) => {
      // If logged in, set user, otherwise redirect to login page
      if (res2.status == 200) {
        setPodcasts((prevPodcasts) => [...prevPodcasts, ...res2.myPodcasts]);
      } else {
        setPodcastError("Podcasts cannot be fetched");
      }
    });
  }, [page]);

  // Form errors
  const [podcastError, setPodcastError] = useState("");

  useEffect(() => {
    const extractEpisodes = () => {
      const allEpisodesArray: Episode[] = [];
      if (podcasts != null) {
        podcasts.forEach((podcast) => {
          if (podcast.episodes && podcast.episodes.length > 0) {
            allEpisodesArray.push(...podcast.episodes);
            setAllEpisodes(allEpisodesArray);
            setRange(3);
          }
        });
      }
    };

    extractEpisodes();
  }, [podcasts]);

  useEffect(() => {
    setRangeEpisodes(allEpisodes.slice(0, range));
  }, [range]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setRange((range) => range + 2);
  };

  return (
    <>
      {/* Render the heading */}
      <div
        style={{
          marginBottom: "1em",
          fontSize: "1.5em",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        My Episodes
        <NextLink href="/MyPodcasts" passHref>
          <Button
            style={{
              fontWeight: "bold",
              marginRight: "0",
              borderRadius: "10em",
              borderColor: "rgba(158, 202, 237, 0.6)",
            }}
          >
            Manage Episodes
          </Button>
        </NextLink>
      </div>
      {rangeEpisodes && rangeEpisodes.length == 0 ? (
        <Text mt={"50px"} mb={"50px"} fontSize={"18px"} textAlign={"center"}>
          You have not uploaded any Episodes yet
        </Text>
      ) : (
        <>
          {/* Render the list of selected episodes */}
          <VStack spacing={6} w={{ base: "auto", md: "lg" }}>
            {rangeEpisodes.map((episode, index) => (
              <Stack
                key={index}
                direction="column"
                spacing={4}
                p={6}
                style={{
                  backgroundColor: useColorModeValue(
                    "rgba(255, 255, 255, 0.1)",
                    "rgba(0, 0, 0, 0.1)",
                  ),
                  backdropFilter: "blur(10px)",
                }}
                border="1px solid"
                borderColor="blue.100"
                onClick={() => {
                  dispatch({ type: "SET_EPISODE", payload: episode });
                }}
                _hover={{
                  cursor: "pointer",
                  borderColor: "blue.300",
                  boxShadow: useColorModeValue(
                    "0 4px 6px rgba(160, 174, 192, 0.6)",
                    "0 4px 6px rgba(9, 17, 28, 0.9)",
                  ),
                }}
                rounded="2em"
              >
                {/* Render the episode details */}
                <Box textAlign="left">
                  <Link
                    fontSize="xl"
                    lineHeight={1.2}
                    fontWeight="bold"
                    w="100%"
                    _hover={{ color: "blue.400", textDecoration: "underline" }}
                  >
                    {episode.episodeName}
                  </Link>
                  <Text fontSize="md" lineHeight="normal">
                    {episode.description}
                  </Text>
                </Box>
                {/* Render the user avatar and author credentials */}
                <Box></Box>
              </Stack>
            ))}
          </VStack>
          {rangeEpisodes.length < allEpisodes.length && (
            <Flex justify="center" mt={4}>
              <Tooltip label="Load More" placement="top">
                <IconButton
                  aria-label="Load More"
                  icon={<ChevronDownIcon />}
                  onClick={handleLoadMoreClick}
                  size="lg"
                  variant="outline"
                />
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
