// components/PodcastList.js
import React from "react";
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

const MyPodcasts = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
        <Flex
          align="center"
          justify="space-between"
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Text fontSize="30px" fontWeight="bold">
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
            <Link href="/Create">
              <Flex align="center">
                <Tooltip label="Create">
                  <IconButton
                    aria-label="Create"
                    icon={<AddIcon />}
                    variant="ghost"
                    size="lg"
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
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
        {podcasts.map((podcast) => (
          <MyPodcast podcast={podcast} key={podcast.id} />
        ))}
      </Box>
    </>
  );
};

export default MyPodcasts;
