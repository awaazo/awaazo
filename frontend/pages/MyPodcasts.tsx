import React, { useState } from "react";
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

import { AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import Navbar from "../components/shared/Navbar";
import MyPodcast from "../components/myPodcast/MyPodcast";

const podcasts = [
  {
    id: 1,
    name: "Science Explorers",
    podcaster: "James Harden",
    description:
      "A podcast that delves into the wonders of the natural world, from the depths of the ocean to the mysteries of the cosmos.",
    cover: "https://i.ibb.co/RhjmQbm/koga-sum-te-pital.gif",
    isExplicit: false,
    tags: ["Science", "Nature", "Exploration"],
    episodes: [
      {
        title: "Episode 1",
        description: "In this episode, we explore the depths of the ocean.",
      },
      {
        title: "Episode 2",
        description: "In this episode, we explore the mysteries of the cosmos.",
      },
      {
        title: "Episode 3",
        description:
          "In this episode, we delve into the wonders of the natural world.",
      },
    ],
    rating: "7.6",
  },
  {
    id: 2,
    name: "Tech Talk",
    podcaster: "James Harden",
    description:
      "Stay updated with the latest in technology, gadgets, and innovations from industry experts and tech enthusiasts.",
    cover:
      "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
    isExplicit: true,
    tags: ["Technology", "Gadgets", "Innovation"],
    episodes: [
      {
        title: "Episode 1",
        description: "In this episode, we explore the depths of the ocean.",
      },
      {
        title: "Episode 2",
        description: "In this episode, we explore the mysteries of the cosmos.",
      },
      {
        title: "Episode 3",
        description:
          "In this episode, we delve into the wonders of the natural world.",
      },
    ],
    rating: "7.6",
  },
  {
    id: 3,
    name: "Mindful Living",
    podcaster: "James Harden",
    description:
      "Explore the art of mindfulness and find inner peace with expert guidance on meditation, self-care, and holistic well-being.",
    cover:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
    isExplicit: false,
    tags: ["Mindfulness", "Self-Care", "Well-being"],
    episodes: [
      {
        title: "Episode 1",
        description: "In this episode, we explore the depths of the ocean.",
      },
      {
        title: "Episode 2",
        description: "In this episode, we explore the mysteries of the cosmos.",
      },
      {
        title: "Episode 3",
        description:
          "In this episode, we delve into the wonders of the natural world.",
      },
    ],
    rating: "7.6",
  },
];

const MyPodcasts = () => {
  const { colorMode } = useColorMode();

  // Initialize the state with the ID of the first podcast
  const [selectedPodcastId, setSelectedPodcastId] = useState(podcasts[0].id);

  const togglePodcastDetail = (id) => {
    if (selectedPodcastId === id) {
      setSelectedPodcastId(null);
    } else {
      setSelectedPodcastId(id);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingEpisode, setCurrentEditingEpisode] = useState(null);

  // State for managing modal visibility and the current episode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const openEditModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentEpisode(null);
  };

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
                    src={podcast.cover}
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
                  <Button
                    style={{
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
                  }}
                >
                  <Text fontSize="md" fontWeight="bold">
                    👂 Listeners: 5
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
                          <Text fontWeight="bold">{episode.title}</Text>
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
                            onClick={() => openEditModal(episode)}
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
      {/* Modal for editing an episode */}
      <Modal isOpen={isModalOpen} onClose={closeEditModal}>
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
            {/* Content of your modal goes here, such as forms for editing the episode */}
            <Box display="flex" justifyContent="center" alignItems="center">
              {/* Example: Form fields to edit the episode */}
              <VStack
                spacing={5}
                align="center"
                backgroundColor={"transparent"}
              >
                {/* You can add form elements here based on 'currentEpisode' */}
                <Text>Edit Episode: {currentEpisode?.title}</Text>
                {/* Add more elements as needed */}
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyPodcasts;
