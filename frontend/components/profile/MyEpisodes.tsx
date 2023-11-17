import React from "react";
import {
  Box,
  Tag,
  Avatar,
  HStack,
  Text,
  Icon,
  Link,
  useColorModeValue,
  Stack,
  VStack,
} from "@chakra-ui/react";

// Here we have used react-icons package for the icon
import { FaPlay } from "react-icons/fa";

// Define an array of episodes
const episodes = [
  {
    podcastId: 1,
    episodeId: 1,
    type: "podcast", // Add a 'type' field to specify that it's a podcast episode
    tags: ["News", "Product", "AI Generated"],
    title: "Episode 1: Build a Modern User Interface with Chakra UI", // Add 'Episode X:' to the title
    content: `In this episode, we discuss how to build a modern user interface with Chakra UI. Lorem Ipsum is simply dummy text of the printing and typesetting industry. simply dummy text...`,
    userAvatar:
      "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
    username: "Elon Musk",
    created_at: "Wed Apr 06 2022",
  },
  {
    podcastId: 2,
    episodeId: 1,
    type: "podcast", // Add 'type' field for the second episode
    tags: ["Web Development", "Video", "AI Generated"],
    title:
      "Episode 1: The Complete Guide to Ruby on Rails Encrypted Credentials", // Add 'Episode X:' to the title
    content: `In this episode, we dive deep into the complete guide to Ruby on Rails encrypted credentials. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    userAvatar:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
    username: "Oprah Winfrey",
    created_at: "Sun Apr 03 2022",
  },
  {
    podcastId: 2,
    episodeId: 2,
    type: "podcast", // Add 'type' field for the third episode
    tags: ["Web Development", "Audio", "AI Generated"],
    title: "Episode 2: The Future of Web Development", // Add 'Episode X:' to the title
    content: `In this episode, we discuss the future of web development. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    userAvatar:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
    username: "Oprah Winfrey",
    created_at: "Sun Apr 10 2022",
  },
];

// Define the MyEpisodes component
export default function MyEpisodes({ selectedPodcastId }) {
  // Filter the episodes based on the selected podcastId
  let selectedEpisodes = episodes.filter(
    (episode) => episode.podcastId === selectedPodcastId
  );
  return (
    <>
      {/* Render the heading */}
      <h1
        style={{
          marginBottom: "0.5em",
          fontSize: "1.5em",
          fontWeight: "bold",
        }}
      >
        My Episodes
      </h1>
      {/* Render the list of selected episodes */}
      <VStack spacing={8} w={{ base: "auto", md: "2xl" }}>
        {selectedEpisodes.map((episode, index) => (
          <Stack
            key={index}
            direction="column"
            spacing={4}
            p={8}
            style={{
              backgroundColor: useColorModeValue(
                "rgba(255, 255, 255, 0.1)",
                "rgba(0, 0, 0, 0.1)"
              ),
              backdropFilter: "blur(10px)",
            }}
            border="1px solid"
            borderColor="blue.100"
            _hover={{
              borderColor: "blue.300",
              boxShadow: useColorModeValue(
                "0 4px 6px rgba(160, 174, 192, 0.6)",
                "0 4px 6px rgba(9, 17, 28, 0.9)"
              ),
            }}
            rounded="2em"
          >
            {/* Render the tags */}
            <HStack spacing={2} mb={1}>
              {episode.tags.map((category, index) => (
                <Tag
                  key={index}
                  colorScheme={useColorModeValue("blackAlpha", "gray")}
                  borderRadius="full"
                >
                  {category}
                </Tag>
              ))}
            </HStack>
            {/* Render the episode details */}
            <Box textAlign="left">
              <Link
                fontSize="xl"
                lineHeight={1.2}
                fontWeight="bold"
                w="100%"
                _hover={{ color: "blue.400", textDecoration: "underline" }}
              >
                {episode.title}
              </Link>
              <Text fontSize="md" lineHeight="normal">
                {episode.content}
              </Text>
            </Box>
            {/* Render the user avatar and author credentials */}
            <Box>
              <Avatar
                size="sm"
                title="Author"
                mb={2}
                src={episode.userAvatar}
              />

              <Stack
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
              >
                {/* Render the author credentials */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {episode.username}
                  </Text>
                  <Text fontSize="sm">{episode.created_at}</Text>
                </Box>
                {/* Render the play button */}
                <HStack
                  as={Link}
                  spacing={1}
                  p={1}
                  alignItems="center"
                  height="2rem"
                  w="max-content"
                  margin="auto 0"
                  rounded="lg"
                  color="blue.400"
                  _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
                >
                  <Icon as={FaPlay} w={6} h={6} />
                </HStack>
              </Stack>
            </Box>
          </Stack>
        ))}
      </VStack>
    </>
  );
}
