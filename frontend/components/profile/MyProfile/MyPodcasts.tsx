import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  Stack,
  Grid,
  useBreakpointValue,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Container,
  Spinner,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

import Link from "next/link";
import { Podcast } from "../../../utilities/Interfaces";
import PodcastHelper from "../../../helpers/PodcastHelper";
import PodcastCard from "../../cards/PodcastCard";

export default function Podcasts() {
  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 3 });
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const [isLoading, setIsLoading] = useState(false);

  // Form errors
  const [podcastError, setPodcastError] = useState("");

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const res2 = await PodcastHelper.podcastMyPodcastsGet(page, pageSize);
        if (res2.status == 200) {
          setPodcasts((prevPodcasts) => [...prevPodcasts, ...res2.myPodcasts]);
        } else {
          setPodcastError("Podcasts cannot be fetched");
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setPodcastError("Failed to load podcasts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, [page]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };

  // const [subscribed, setSubscribe] = useState(false);

  let subscribed = false;
  let subscribedText = "Subscribe";

  function setSubscribe() {
    // if (!subscribed){
    //   subscribed = true;
    //   subscribedText = "Subscribe";
    // } else {
    //   subscribed = false;
    //   subscribedText = "UnSubscribe";
    // }
  }

  return (
    <>
      <Container
        marginBottom="1em"
        fontSize="1.5em"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        My Podcasts
        <Link href="/CreatorHub/MyPodcasts" passHref>
          <Button
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              borderRadius: "10em",
              borderColor: "rgba(158, 202, 237, 0.6)",
            }}
          >
            Manage Podcasts
          </Button>
        </Link>
      </Container>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100px">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        </Flex>
      ) : (
        <>
          {podcastError && (
            <Text color="red.500" textAlign="center">
              {podcastError}
            </Text>
          )}

          {podcasts && podcasts.length == 0 ? (
            <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
              You have not created any podcasts yet.
            </Text>
          ) : (
            <>
              <Grid
                templateColumns={`repeat(${columns}, 1fr)`}
                gap={6}
                placeItems="center"
              >
                {podcasts.map((podcast, index) => (
                  <Stack
                    key={index}
                    spacing={4}
                    direction="column"
                    align="center"
                    height="100%"
                    width="100%"
                  >
                    <PodcastCard podcast={podcast} />
                  </Stack>
                ))}
              </Grid>
            </>
          )}
          {podcasts[(page + 1) * pageSize - 1] != null && (
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
