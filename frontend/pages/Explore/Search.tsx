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

  const [searchInput, setSearchInput] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [getError, setGetError] = useState("");
  const [podcastFilter, setPodcastFilter] = useState({
    searchTerm: searchTerm,
    tags: null,
    type: null,
    isExplicit: null,
    ratingGreaterThan: null,
    releaseDate: null,
  });
  const [episodeFilter, setEpisodeFilter] = useState({
    searchTerm: searchTerm,
    isExplicit: null,
    releaseDate: null,
    minEpisodeLength: null,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchPodcasts = async () => {
    setLoadingPodcasts(true);
    try {
      const res = await PodcastHelper.podcastSearchPodcastsGet(
        1,
        10,
        podcastFilter,
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
    try {
      const res = await PodcastHelper.podcastSearchEpisodeGet(
        1,
        10,
        episodeFilter,
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
        1,
        10,
        searchTerm,
      );
      if (res.status === 200) {
        setUsers(res.users);
      } else {
        setGetError("Users cannot be fetched");
      }
    } catch (error) {
      setGetError("Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  };

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

  const applyPodcastFilter = () => {
    fetchPodcasts();
    onPodcastModalClose();
  };

  const applyEpisodeFilter = () => {
    fetchEpisodes();
    onEpisodeModalClose();
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
                <Text fontSize="2xl" fontWeight="bold" ml={"15px"}>
                  Podcasts
                </Text>
                <Button
                  onClick={onPodcastModalOpen}
                  variant={"ghost"}
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
                <SimpleGrid columns={6} spacing={5}>
                  {podcasts.map((podcast) => (
                    <PodcastCard podcast={podcast} key={podcast.id} />
                  ))}
                </SimpleGrid>
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
                <Text fontSize="2xl" fontWeight="bold" ml={"15px"}>
                  Episodes
                </Text>
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
                <SimpleGrid columns={3} spacing={5}>
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
                <SimpleGrid columns={3} spacing={5}>
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
            <GenreSelector onGenresChange={(genres) => {}} />
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                value={podcastFilter.type}
                onChange={(e) =>
                  handlePodcastFilterChange("type", e.target.value)
                }
              >
                {/* Update with your actual types */}
                <option value="">Any</option>
                <option value="type1">AI Generated</option>
                <option value="type2">Human Made</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Is Explicit</FormLabel>
              <Switch
                isChecked={podcastFilter.isExplicit}
                onChange={(e) =>
                  handlePodcastFilterChange("isExplicit", e.target.checked)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Rating Greater Than</FormLabel>
              <NumberInput
                value={podcastFilter.ratingGreaterThan}
                onChange={(value) =>
                  handlePodcastFilterChange("ratingGreaterThan", value)
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Release Date</FormLabel>
              <Input
                type="date"
                value={podcastFilter.releaseDate}
                onChange={(e) =>
                  handlePodcastFilterChange("releaseDate", e.target.value)
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={applyPodcastFilter}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Episode Filter Modal */}
      <Modal isOpen={isEpisodeModalOpen} onClose={onEpisodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Episodes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Is Explicit</FormLabel>
              <Switch
                isChecked={episodeFilter.isExplicit}
                onChange={(e) =>
                  handleEpisodeFilterChange("isExplicit", e.target.checked)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Release Date</FormLabel>
              <Input
                type="date"
                value={episodeFilter.releaseDate}
                onChange={(e) =>
                  handleEpisodeFilterChange("releaseDate", e.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Minimum Episode Length</FormLabel>
              <NumberInput
                value={episodeFilter.minEpisodeLength}
                onChange={(value) =>
                  handleEpisodeFilterChange("minEpisodeLength", value)
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={applyEpisodeFilter}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
