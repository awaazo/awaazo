import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  useColorMode,
  useBreakpointValue,
  Text,
  VStack,
  Image,
  Wrap,
} from "@chakra-ui/react";

import {
  AddIcon,
  ChevronDownIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";

import Navbar from "../../components/shared/Navbar";
import MyPodcast from "../../components/myPodcast/MyPodcast";
import { UserMenuInfo, Podcast } from "../../utilities/Interfaces";
import router from "next/router";
import AuthHelper from "../../helpers/AuthHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import NextLink from "next/link";

const MyPodcasts = () => {
  // Page refs
  const loginPage = "/auth/Login";
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Current User
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 6;

  // Form errors
  const [createError, setCreateError] = useState("");

  // Initialize the state with the ID of the first podcast
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);

  const togglePodcastDetail = (id) => {
    if (selectedPodcastId === id) {
      setSelectedPodcastId(null);
    } else {
      setSelectedPodcastId(id);
    }
  };

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
        PodcastHelper.podcastMyPodcastsGet(page, pageSize).then((res2) => {
          // If logged in, set user, otherwise redirect to login page
          if (res2.status == 200) {
            setPodcasts((prevPodcasts) => [
              ...prevPodcasts,
              ...res2.myPodcasts,
            ]);

            setSelectedPodcastId(
              res2.myPodcasts.length > 0 ? res2.myPodcasts[0].id : null,
            );
          } else {
            setCreateError("Podcasts cannot be fetched");
          }
        });
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router, page]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };

  // Function to navigate to create podcast page
  const navigateToCreatePodcast = () => {
    router.push("/CreatorHub/CreatePodcast");
  };

  return (
    <>
      <Navbar />

      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
        <Flex align="center" justify="space-between" p={4}>
          <Text fontSize="30px" fontWeight={"light"}>
            My Podcasts
          </Text>

          <Flex align="center" justify="flex-end" flex="1">
            <Link href="/Main">
              <Flex align="center">
                <Tooltip label="Help">
                  <IconButton
                    aria-label="Help"
                    icon={<QuestionOutlineIcon />}
                    variant="ghost"
                    size="lg"
                    mr={1}
                    rounded={"full"}
                    opacity={0.7}
                    color={colorMode === "dark" ? "white" : "black"}
                  />
                </Tooltip>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Box>
      <Box px={["1em", "2em", "4em"]} pt={6}>
        <Flex
          direction="row"
          wrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <Wrap spacing={6}>
            {podcasts.map((podcast) => (
              <VStack
                key={podcast.id}
                spacing={2}
                onClick={() => togglePodcastDetail(podcast.id)}
                align="center"
              >
                <Box position="relative" boxSize="150px">
                  <Image
                    borderRadius="2.5em"
                    boxSize="150px"
                    objectFit="cover"
                    src={podcast.coverArtUrl}
                    alt={podcast.name}
                    boxShadow={
                      selectedPodcastId === podcast.id
                        ? "0 0 10px rgba(0, 0, 0, 0.5)"
                        : ""
                    }
                    style={{
                      outline:
                        selectedPodcastId === podcast.id
                          ? "3px solid #9ecaed"
                          : "1px solid rgba(255, 255, 255, 0.5)",
                      cursor: "pointer",
                    }}
                    data-cy={`podcast-image-${podcast.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  />
                </Box>

                <Text fontSize="lg">
                  {podcast.name.length > 18
                    ? `${podcast.name.substring(0, 18)}...`
                    : podcast.name}
                </Text>
              </VStack>
            ))}
            <NextLink href="/CreatorHub/CreatePodcast" passHref>
              <Flex
                direction="column"
                alignItems="center"
                borderRadius="1em"
                cursor="pointer"
                outline="none"
                p={2}
                m={2}
                bg="transparent"
              >
                <Box
                  boxSize="100px"
                  borderRadius="2em"
                  border="2px dashed gray"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AddIcon w={10} h={10} />
                </Box>
                <Text mt={2}>Create a Podcast</Text>
              </Flex>
            </NextLink>
          </Wrap>
        </Flex>
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

        {selectedPodcastId !== null && (
          <MyPodcast podcastId={selectedPodcastId} />
        )}
      </Box>
    </>
  );
};

export default MyPodcasts;
