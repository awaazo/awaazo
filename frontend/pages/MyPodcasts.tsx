import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Button,
  MenuGroup,
  Tooltip,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Text,
  Collapse,
  SimpleGrid,
  VStack,
  Image,
  HStack,
  Wrap,
  WrapItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import Navbar from "../components/shared/Navbar";
import EditEpisodeForm from "../components/myPodcast/EditEpisodeForm";
import EditPodcastForm from "../components/myPodcast/EditPodcastForm";
import { UserMenuInfo, Podcast } from "../utilities/Interfaces";
import router from "next/router";
import AuthHelper from "../helpers/AuthHelper";
import PodcastHelper from "../helpers/PodcastHelper";
import MyPodcast from "../components/myPodcast/MyPodcast";

const MyPodcasts = () => {
  // Page refs
  const loginPage = "/auth/Login";
  const MyPodcastsPage = "/MyPodcasts";

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
        PodcastHelper.podcastMyPodcastsGet().then((res2) => {
          // If logged in, set user, otherwise redirect to login page
          if (res2.status == 200) {
            setPodcasts(res2.myPodcasts);
            setSelectedPodcastId(podcasts.length > 0 ? podcasts[0].id : null);
          } else {
            setCreateError("Podcasts cannot be fetched");
          }
        });
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

  const { colorMode } = useColorMode();

  // Current User
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

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
  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Handle Deletion of podcast
  const handleDelete = async () => {
    setDeleting(true);
    // Create request object

    const response = await PodcastHelper.deletePodcast(selectedPodcastId);

    console.log(response);

    if (response.status == 200) {
      window.location.href = MyPodcastsPage;
    } else {
      setCreateError("Podcasts cannot be deleted");
    }
    onClose();
    setDeleting(false);
  };

  // Edit Episode Modal
  //----------------------------------------------------------------------
  const [isEditEpisodeModalOpen, setIsEditEpisodeModalOpen] = useState(false);
  const [currentEditingEpisode, setCurrentEditingEpisode] = useState(null);

  // State for managing modal visibility and the current episode
  const [isModalEpisodeOpen, setIsModalEpisodeOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const openEditEpisodeModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalEpisodeOpen(true);
  };
  const closeEditEpisodeModal = () => {
    setIsModalEpisodeOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // Edit Podcast Modal
  //----------------------------------------------------------------------
  const [isEditPodcastModalOpen, setIsEditPodcastModalOpen] = useState(false);

  // State for managing modal visibility and the current episode
  const [isModalPodcastOpen, setIsModalPodcastOpen] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const openEditPodcastModal = () => {
    setIsModalPodcastOpen(true);
  };
  const closeEditPodcastModal = () => {
    setIsModalPodcastOpen(false);
  };
  //----------------------------------------------------------------------

  return (
    <>
      <Navbar />
      <Box px={["1em", "2em", "4em"]} pt={6}>
        <Flex align="center" pb={4} flexWrap={"wrap"}>
          <Text fontSize="30px" pb="1em">
            My Podcasts
          </Text>
        </Flex>

        <Flex justify={{ base: "center", md: "flex-start" }} pb={4}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={"3em"}>
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
                  />
                </Box>
                <Text fontSize="lg">{podcast.name}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Flex>

        {podcasts.map((podcast) => (
          <Collapse in={selectedPodcastId === podcast.id} key={podcast.id}>
            {selectedPodcastId === podcast.id && (
              <VStack
                p={4}
                mt={"2em"}
                borderWidth="1px"
                borderRadius="2em"
                align="start"
                padding={"3em"}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Wrap align="center" spacing={4}>
                    <WrapItem>
                      <Text fontSize="xl" fontWeight="bold">
                        🎙️ {podcast.name}
                      </Text>
                    </WrapItem>

                    {/* Display tags */}
                    {podcast.tags.map((tag, index) => (
                      <WrapItem key={index}>
                        <Box
                          bg={
                            colorMode === "dark"
                              ? "rgba(50, 153, 175, 0.4)"
                              : "rgba(140, 216, 230, 0.5)"
                          }
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          <Text fontSize="md">{tag}</Text>
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      onClick={() => openEditPodcastModal()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "10em",
                        padding: "1em",
                        color: colorMode === "dark" ? "white" : "black",
                        outline:
                          colorMode === "dark"
                            ? "solid 1px rgba(158, 202, 237, 0.6)"
                            : "solid 1px rgba(158, 202, 237, 0.6)",
                        boxShadow: "0 0 15px rgba(158, 202, 237, 0.6)",
                      }}
                    >
                      Edit Podcast
                    </Button>{" "}
                    {/* Edit button */}
                    <Button
                      colorScheme="red"
                      leftIcon={<DeleteIcon style={{ marginLeft: "5px" }} />}
                      onClick={onOpen}
                      isLoading={isDeleting}
                    ></Button>
                  </div>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Confirm Deletion</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        Are you sure you want to delete this item? This action
                        cannot be undone
                      </ModalBody>
                      <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" ml={3} onClick={handleDelete}>
                          Delete
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Flex>
                <Text
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "1em",
                    padding: "1em",
                    outline: "2px solid rgba(255, 255, 255, 0.1)",
                    marginBottom: "0.5em",
                    marginTop: "1em",
                  }}
                >
                  {podcast.description}
                </Text>
                <Box
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "1em",
                    padding: "1em",
                    outline: "2px solid rgba(255, 255, 255, 0.1)",
                    marginBottom: "2em",
                    wordSpacing: "0.5em",
                  }}
                >
                  <Text fontSize="md" fontWeight="bold">
                    🎧 Listeners: 5
                  </Text>
                  <Text fontSize="md" fontWeight="bold">
                    📊 Subscribers: 5
                  </Text>
                  <Text fontSize="md" fontWeight="bold">
                    ❤️ Likes: 5
                  </Text>
                </Box>
                <>
                  {podcast.episodes.map((episode, index) => (
                    <Box
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        paddingLeft: "2em",
                        paddingRight: "2em",
                        paddingTop: "1em",
                        paddingBottom: "1em",
                        borderRadius: "1em",
                        marginBottom: "1em",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                        outline: "2px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <VStack key={index} align="start" spacing={2}>
                        <HStack width="full" spacing={2}>
                          <Text fontWeight="bold">{episode.episodeName}</Text>
                          <Spacer />
                          <HStack spacing={2}>
                            <Text fontSize="md" fontWeight="bold">
                              🎧 25
                            </Text>
                            <Text fontSize="md" fontWeight="bold">
                              ❤️ 69
                            </Text>
                          </HStack>
                          <Spacer />
                          <Button
                            onClick={() => openEditEpisodeModal(episode)}
                            style={{
                              borderRadius: "3em",
                              colorScheme: "blue",
                              fontSize: "0.9em",
                            }}
                          >
                            Edit Episode
                          </Button>
                        </HStack>
                        <Text marginBottom={"2em"}>{episode.description}</Text>
                      </VStack>
                    </Box>
                  ))}
                </>
              </VStack>
            )}
          </Collapse>
        ))}
      </Box>
      {/* Modal for editing a podcast */}
      <Modal isOpen={isModalPodcastOpen} onClose={closeEditPodcastModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          boxShadow="dark-lg"
          backdropFilter="blur(40px)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop={"10%"}
          padding={"2em"}
        >
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack
                spacing={5}
                align="center"
                backgroundColor={"transparent"}
              >
                <Text>Edit Podcast: {currentEpisode?.title}</Text>
                <EditPodcastForm podcastId={selectedPodcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for editing an episode */}
      <Modal isOpen={isModalEpisodeOpen} onClose={closeEditEpisodeModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          boxShadow="dark-lg"
          backdropFilter="blur(40px)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop={"10%"}
          padding={"2em"}
        >
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack
                spacing={5}
                align="center"
                backgroundColor={"transparent"}
              >
                {/* You can add form elements here based on 'currentEpisode' */}
                <Text>Edit Episode: {currentEpisode?.title}</Text>
                {/* Add more elements as needed */}

                <EditEpisodeForm />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyPodcasts;
