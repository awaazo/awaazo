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
    episodes: ["Episode 1", "Episode 2", "Episode 3"],
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
    episodes: ["Episode 1", "Episode 2", "Episode 3", "Episode 4"],
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
    episodes: ["Episode 1", "Episode 2"],
    rating: "7.6",
  },
];

const MyPodcasts = () => {
  const { colorMode } = useColorMode();
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);

  const togglePodcastDetail = (id) => {
    if (selectedPodcastId === id) {
      setSelectedPodcastId(null);
    } else {
      setSelectedPodcastId(id);
    }
  };

  return (
    <>
      <Navbar />
      <Box px={["1em", "2em", "4em"]} pt={6}>
        <Flex align="center" pb={4} flexWrap={"wrap"}>
          <Text fontSize="30px" pb="1em" fontFamily={"Avenir Next"}>
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
                    borderRadius="3em"
                    boxSize="150px"
                    objectFit="cover"
                    src={podcast.cover}
                    alt={podcast.name}
                    style={{
                      boxShadow:
                        selectedPodcastId === podcast.id
                          ? "0 0 10px #9ecaed"
                          : "",
                      outline:
                        selectedPodcastId === podcast.id
                          ? "2px solid #9ecaed"
                          : "2px solid rgba(255, 255, 255, 0.5)",
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
                borderRadius="1em"
                align="start"
                padding={"2em"}
              >
                <Flex justify="space-between" align="center" w="full" >
                  <Wrap align="center" spacing={4}>
                    <WrapItem>
                      <Text fontSize="xl" fontWeight="bold" >
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
                    marginBottom: "1em",
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
                <Text mt={2} fontWeight="bold">
                  Episodes:
                </Text>
                {podcast.episodes.map((episode, index) => (
                  <Text key={index}>{episode}</Text>
                ))}
              </VStack>
            )}
          </Collapse>
        ))}
      </Box>
    </>
  );
};

export default MyPodcasts;
