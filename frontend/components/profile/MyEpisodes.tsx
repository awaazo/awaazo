import React from "react";
import { Box, Tag, Avatar, HStack, Text, Icon, Link, useColorModeValue, Stack, VStack } from "@chakra-ui/react";

// Here we have used react-icons package for the icon
import { FaPlay } from "react-icons/fa";

const episodes = [
  {
    podcastId: 1,
    episodeId: 1,
    type: "podcast", // Add a 'type' field to specify that it's a podcast episode
    tags: ["News", "Product", "AI Generated"],
    title: "Episode 1: Build a Modern User Interface with Chakra UI", // Add 'Episode X:' to the title
    content: `In this episode, we discuss how to build a modern user interface with Chakra UI. Lorem Ipsum is simply dummy text of the printing and typesetting industry. simply dummy text...`,
    userAvatar: "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
    username: "Elon Musk",
    created_at: "Wed Apr 06 2022",
  },
  {
    podcastId: 2,
    episodeId: 1,
    type: "podcast", // Add 'type' field for the second episode
    tags: ["Web Development", "Video", "AI Generated"],
    title: "Episode 1: The Complete Guide to Ruby on Rails Encrypted Credentials", // Add 'Episode X:' to the title
    content: `In this episode, we dive deep into the complete guide to Ruby on Rails encrypted credentials. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    userAvatar: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
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
    userAvatar: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
    username: "Oprah Winfrey",
    created_at: "Sun Apr 10 2022",
  },
];

export default function MyEpisodes({selectedPodcastId}) {
  let selectedEpisodes = episodes.filter(episode => episode.podcastId === selectedPodcastId);
  return (
    <>
      <h1
        style={{
          marginBottom: "0.5em",
          fontSize: "1.5em",
          fontWeight: "bold",
        }}
      >
        My Episodes
      </h1>
      <VStack spacing={8} w={{ base: "auto", md: "2xl" }}>
        {selectedEpisodes.map((episode, index) => (
          <Stack
            key={index}
            direction="column"
            spacing={4}
            p={8}
            // bg={useColorModeValue("gray.100", "gray.800")}
            border="1px solid"
            borderColor="blue.100"
            _hover={{
              borderColor: "blue.300",
              // boxShadow: useColorModeValue("0 4px 6px rgba(160, 174, 192, 0.6)", "0 4px 6px rgba(9, 17, 28, 0.9)"),
            }}
            rounded="2em"
          >
            <HStack spacing={2} mb={1}>
              {episode.tags.map((category, index) => (
                <Tag key={index}  borderRadius="full">
                  {category}
                </Tag>
              ))}
            </HStack>
            <Box textAlign="left">
              <Link fontSize="xl" lineHeight={1.2} fontWeight="bold" w="100%" _hover={{ color: "blue.400", textDecoration: "underline" }}>
                {episode.title}
              </Link>
              <Text fontSize="md" color="gray.500" noOfLines={2} lineHeight="normal">
                {episode.content}
              </Text>
            </Box>
            <Box>
              <Avatar size="sm" title="Author" mb={2} src={episode.userAvatar} />

              <Stack justify="space-between" direction={{ base: "column", sm: "row" }}>
                {/* author credentials section */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {episode.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {episode.created_at}
                  </Text>
                </Box>
                <HStack as={Link} spacing={1} p={1} alignItems="center" height="2rem" w="max-content" margin="auto 0" rounded="lg" color="blue.400">
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
