import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  VStack,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  NumberInput,
  NumberInputField,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  HStack,
  Divider,
  useBreakpointValue,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import { IoFilterSharp } from "react-icons/io5";
import PodcastHelper from "../../helpers/PodcastHelper";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import PodcastCard from "../../components/cards/PodcastCard";
import UserCard from "../../components/cards/UserCard";
import EpisodeCard from "../../components/cards/EpisodeCard";
import GenreSelector from "../../components/tools/GenreSelector";
import ForYou from "../../components/home/ForYou";
import ExploreGenres from "../../components/home/ExploreGenres";
import { formatSecToDurationString } from "../../utilities/CommonUtils";
import { FaXmark } from "react-icons/fa6";
import { set } from "lodash";

export default function MyPodcast() {
  const {
    isOpen: isPodcastModalOpen,
    onOpen: onPodcastModalOpen,
    onClose: onPodcastModalClose,
  } = useDisclosure();
  const {
    isOpen: isEpisodeModalOpen,
    onOpen: onEpisodeModalOpen,
    onClose: onEpisodeModalClose,
  } = useDisclosure();
  const router = useRouter();

  const { searchTerm } = router.query;

  //Page Values
  const [searchInput, setSearchInput] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [getError, setGetError] = useState("");

  const [podcastFilter, setPodcastFilter] = useState({
    tags: null,
    type: null,
    isExplicit: null,
    ratingGreaterThan: null,
    releaseDate: null,
  });
  const [episodeFilter, setEpisodeFilter] = useState({
    isExplicit: null,
    releaseDate: null,
    minEpisodeLength: null,
  });

  const [episodeRefresh, setEpisodeRefresh] = useState(false);
  const handleEpisodeRefresh = () => {
    setEpisodeRefresh(!episodeRefresh);
  };

  const [podcastRefresh, setPodcastRefresh] = useState(false);
  const handlePodcastRefresh = () => {
    setPodcastRefresh(!podcastRefresh);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (searchTerm != "" && searchTerm != null && searchTerm != undefined) {
      fetchPodcasts();
    }
  }, [searchTerm, podcastRefresh]);

  useEffect(() => {
    if (searchTerm != "" && searchTerm != null && searchTerm != undefined) {
      fetchEpisodes();
    }
  }, [searchTerm, episodeRefresh]);

  useEffect(() => {
    if (searchTerm != "" && searchTerm != null && searchTerm != undefined) {
      fetchUsers();
    }
  }, [searchTerm]);

  // Async functions to fetch podcasts, episodes, and users from an API
  const fetchPodcasts = async () => {
    setLoadingPodcasts(true);
    const requestData = { searchTerm: searchTerm, ...podcastFilter };
    try {
      const res = await PodcastHelper.podcastSearchPodcastsGet(
        0,
        6,
        requestData,
      );
      if (res.status === 200) {
        setPodcasts(res.podcasts);
      } else {
        setGetError("Podcasts cannot be fetched");
      }
    } catch (error) {
      setGetError("Error fetching podcasts");
    } finally {
      setLoadingPodcasts(false);
    }
  };

  const fetchEpisodes = async () => {
    setLoadingEpisodes(true);
    const requestData = { searchTerm: searchTerm, ...episodeFilter };
    try {
      const res = await PodcastHelper.podcastSearchEpisodeGet(
        0,
        6,
        requestData,
      );
      if (res.status === 200) {
        setEpisodes(res.episodes);
      } else {
        setGetError("Episodes cannot be fetched");
      }
    } catch (error) {
      setGetError("Error fetching episodes");
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await UserProfileHelper.profileSearchProfilesGet(
        0,
        9,
        searchTerm,
      );
      if (res.status === 200) {
        setUsers(res.users);
        console.log(res.users);
      } else {
        setGetError("Users cannot be fetched");
      }
    } catch (error) {
      setGetError("Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Function to handle search form submission
  const handleSearchSubmit = () => {
    router.push(
      {
        pathname: "/Explore/Search",
        query: { searchTerm: searchInput },
      },
      undefined,
      { shallow: true },
    );
  };

  const handlePodcastFilterChange = (name, value) => {
    setPodcastFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleEpisodeFilterChange = (name, value) => {
    setEpisodeFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Functions to apply filters and fetch relevant data
  const applyPodcastFilter = () => {
    fetchPodcasts();
    onPodcastModalClose();
  };

  const applyEpisodeFilter = () => {
    fetchEpisodes();
    onEpisodeModalClose();
  };

  // Function to remove a specific tag from the podcast filter
  const removeTagFromFilter = (tagToRemove) => {
    setPodcastFilter((prev) => {
      const updatedTags = prev.tags.filter((tag) => tag !== tagToRemove);

      // Check if the updatedTags array is empty and set it to null if it is
      const newTags = updatedTags.length === 0 ? null : updatedTags;

      return {
        ...prev,
        tags: newTags,
      };
    });
  };

  return (
    <>
      <Box px={["1em", "2em", "4em"]}>
        <Flex
          alignItems="start"
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          mt={4}
          mb={4}
          gridColumn="span 2"
        >
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              borderRadius={"25px"}
              width="400px"
              placeholder="Search for Podcasts, Users, and Episodes"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              pl="40px"
            />
          </InputGroup>
        </Flex>
        {searchTerm == "" || searchTerm == null ? (
          <>
            {" "}
            <Box mb={4}>
              <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
                Explore Genres
              </Text>
              <ExploreGenres />
            </Box>{" "}
            <Box mb={4}>
              <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
                Podcasts For You
              </Text>
              <ForYou />
            </Box>
          </>
        ) : (
          <>
            {" "}
            <Text fontSize="2xl" fontWeight="bold" mb={"25px"}>
              Showing Results For: "{searchTerm}"
            </Text>
            <VStack spacing={4}>
              {/* Podcasts Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <HStack align="start">
                  <Text fontSize="2xl" fontWeight="bold" ml={"15px"}>
                    Podcasts
                  </Text>
                  {!isMobile && (
                    <>
                      {podcastFilter.tags &&
                        podcastFilter.tags.map((tag, index) => (
                          <Flex
                            key={index}
                            fontSize="md"
                            color="gray.700"
                            bg={"#8b8b8b"}
                            padding={"5px"}
                            fontWeight={"bold"}
                            borderRadius={"8px"}
                            alignItems="center"
                            mr="2"
                          >
                            <Button
                              size="xs"
                              variant={"ghost"}
                              onClick={() => {
                                removeTagFromFilter(tag);
                                handlePodcastRefresh();
                              }}
                            >
                              <FaXmark />
                            </Button>
                            <Text>{tag}</Text>
                          </Flex>
                        ))}
                      {/* Display active podcast filters */}
                      {podcastFilter.isExplicit === false && (
                        <Flex
                          fontSize="md"
                          color="gray.700"
                          bg={"#8b8b8b"}
                          padding={"5px"}
                          fontWeight={"bold"}
                          borderRadius={"8px"}
                          alignItems="center"
                        >
                          <Button
                            size="xs"
                            variant={"ghost"}
                            onClick={() => {
                              handlePodcastFilterChange("isExplicit", null);
                              handlePodcastRefresh();
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>Non-Explicit Only</Text>
                        </Flex>
                      )}

                      {podcastFilter.ratingGreaterThan !== null && (
                        <Flex
                          fontSize="md"
                          color="gray.700"
                          bg={"#8b8b8b"}
                          padding={"5px"}
                          fontWeight={"bold"}
                          borderRadius={"8px"}
                          alignItems="center"
                        >
                          <Button
                            size="xs"
                            variant={"ghost"}
                            onClick={() => {
                              handlePodcastFilterChange(
                                "ratingGreaterThan",
                                null,
                              );
                              handlePodcastRefresh();
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>
                            Rating Greater Than:{" "}
                            {podcastFilter.ratingGreaterThan}
                          </Text>
                        </Flex>
                      )}
                    </>
                  )}
                </HStack>

                <Button
                  onClick={onPodcastModalOpen}
                  variant="ghost"
                  mr={"15px"}
                >
                  Filter Podcasts
                  <span style={{ marginRight: "10px" }}></span>
                  <IoFilterSharp />
                </Button>
              </Flex>
              {loadingPodcasts ? (
                <Spinner />
              ) : podcasts.length > 0 ? (
                <HStack
                  alignSelf={"center"}
                  spacing={5}
                  width="100%"
                  justify={isMobile ? "center" : "flex-start"}
                  align={isMobile ? "center" : "stretch"}
                >
                  {podcasts.map((podcast) => (
                    <PodcastCard podcast={podcast} key={podcast.id} />
                  ))}
                </HStack>
              ) : (
                <Text
                  fontWeight={"bold"}
                  fontSize={"18px"}
                  mt={"20px"}
                  mb={"30px"}
                >
                  No Podcasts Found
                </Text>
              )}
              {/* Episodes Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <HStack align="start">
                  <Text fontSize="2xl" fontWeight="bold" ml={"15px"}>
                    Episodes
                  </Text>
                  {!isMobile && (
                    <>
                      {episodeFilter.isExplicit === false && (
                        <Flex
                          fontSize="md"
                          color="gray.700"
                          bg={"#8b8b8b"}
                          padding={"5px"}
                          fontWeight={"bold"}
                          borderRadius={"8px"}
                          alignItems="center"
                        >
                          {" "}
                          <Button
                            size="xs"
                            variant={"ghost"}
                            onClick={() => {
                              handleEpisodeFilterChange("isExplicit", null);
                              handleEpisodeRefresh();
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>Non-Explicit Only</Text>
                        </Flex>
                      )}

                      {episodeFilter.minEpisodeLength && (
                        <Flex
                          fontSize="md"
                          color="gray.700"
                          bg={"#8b8b8b"}
                          padding={"5px"}
                          fontWeight={"bold"}
                          borderRadius={"8px"}
                          alignItems="center"
                        >
                          <Button
                            size="xs"
                            variant={"ghost"}
                            onClick={() => {
                              handleEpisodeFilterChange(
                                "minEpisodeLength",
                                null,
                              );
                              handleEpisodeRefresh();
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>
                            Min Length:{" "}
                            {formatSecToDurationString(
                              episodeFilter.minEpisodeLength,
                            )}
                          </Text>
                        </Flex>
                      )}
                    </>
                  )}
                </HStack>
                <Button
                  onClick={onEpisodeModalOpen}
                  variant="ghost"
                  mr={"15px"}
                >
                  Filter Episodes
                  <span style={{ marginRight: "10px" }}></span>
                  <IoFilterSharp />
                </Button>
              </Flex>
              {loadingEpisodes ? (
                <Spinner />
              ) : episodes.length > 0 ? (
                <SimpleGrid columns={1} spacing={5} width="100%">
                  {episodes.map((episode) => (
                    <EpisodeCard
                      episode={episode}
                      inPlaylist={false}
                      playlistId={null}
                      key={episode.id}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Text
                  fontWeight={"bold"}
                  fontSize={"18px"}
                  mt={"20px"}
                  mb={"30px"}
                >
                  No Episodes Found
                </Text>
              )}
              {/* Users Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <Text fontSize="2xl" fontWeight="bold" ml={"15px"}>
                  Users
                </Text>
              </Flex>
              {loadingUsers ? (
                <Spinner />
              ) : users.length > 0 ? (
                <SimpleGrid columns={3} spacing={5} width="100%">
                  {users.map((user) => (
                    <UserCard user={user} key={user.id} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text
                  fontWeight={"bold"}
                  fontSize={"18px"}
                  mt={"20px"}
                  mb={"30px"}
                >
                  No Users Found
                </Text>
              )}
            </VStack>
          </>
        )}
      </Box>
      {/* Podcast Filter Modal */}
      <Modal isOpen={isPodcastModalOpen} onClose={onPodcastModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Podcasts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl textAlign={"center"} mt={"15px"}>
              <FormLabel textAlign={"center"}>
                Non-Explicit Only
                <Switch
                  ml={"5px"}
                  colorScheme="purple"
                  isChecked={podcastFilter.isExplicit === false}
                  onChange={(e) =>
                    handlePodcastFilterChange(
                      "isExplicit",
                      e.target.checked ? false : null,
                    )
                  }
                />
              </FormLabel>
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>
                Rating Greater Than: {podcastFilter.ratingGreaterThan ?? ""}
              </FormLabel>
              <Slider
                min={0}
                max={5}
                step={0.1}
                value={podcastFilter.ratingGreaterThan ?? 0}
                onChange={(val) =>
                  handlePodcastFilterChange("ratingGreaterThan", val)
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Tags</FormLabel>
              <GenreSelector
                onGenresChange={(genres) =>
                  handlePodcastFilterChange("tags", genres)
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                setPodcastFilter({
                  tags: null,
                  type: null,
                  isExplicit: null,
                  ratingGreaterThan: null,
                  releaseDate: null,
                });
              }}
            >
              Reset
            </Button>
            <Button colorScheme="blue" onClick={applyPodcastFilter}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>{" "}
      {/* Episode Filter Modal */}
      <Modal isOpen={isEpisodeModalOpen} onClose={onEpisodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Episodes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl textAlign={"center"}>
              <FormLabel textAlign={"center"}>
                Non-Explicit Only
                <Switch
                  ml={"5px"}
                  colorScheme="purple"
                  isChecked={episodeFilter.isExplicit === false}
                  onChange={(e) =>
                    handleEpisodeFilterChange(
                      "isExplicit",
                      e.target.checked ? false : null,
                    )
                  }
                />
              </FormLabel>
            </FormControl>

            <FormControl mt={"15px"}>
              <FormLabel>
                Minimum Episode Length:{" "}
                {episodeFilter.minEpisodeLength
                  ? `${formatSecToDurationString(
                      episodeFilter.minEpisodeLength,
                    )}`
                  : ""}
              </FormLabel>
              <Slider
                min={0}
                max={3600}
                value={episodeFilter.minEpisodeLength ?? 0}
                onChange={(val) =>
                  handleEpisodeFilterChange("minEpisodeLength", val)
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                setEpisodeFilter({
                  isExplicit: null,
                  releaseDate: null,
                  minEpisodeLength: null,
                });
              }}
            >
              Reset
            </Button>
            <Button colorScheme="blue" onClick={applyEpisodeFilter}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
