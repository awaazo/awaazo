import React, { useState } from "react";

import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Button,
  MenuGroup,
  Image,
  Tooltip,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  Text,
  Icon,
  Tag,
  Spacer,
} from "@chakra-ui/react";
import { AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { MdSettings } from "react-icons/md";

const handleManagePodcast = (id, podcastName) => {
  const formattedPodcastName = podcastName.replace(/\s/g, "-");
  const newPath = `/MyPodcasts/${formattedPodcastName}`;

  // Redirect to the new page
  window.location.href = newPath;
};

const MyPodcast = ({ podcast }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      p={4}
      mt={4}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      onClick={() => handleManagePodcast(podcast.id, podcast.name)}
      style={{ cursor: "pointer" }}
    >
      <Box position="relative" mr={5}>
        <Image
          boxSize={isMobile ? "90px" : "125px"}
          src={podcast.cover}
          borderRadius="10%"
          mt={1}
        />
      </Box>
      <Flex direction="column" flex={1}>
        {/* Podcast Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {podcast.name}{" "}
          {podcast.isExplicit && (
            <Tag
              size="sm"
              colorScheme="red"
              fontSize={isMobile ? "10px" : "sm"}
            >
              Explicit
            </Tag>
          )}
        </Text>
        {/* Tags, Episodes, and Rating */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          {!isMobile && <Text>{podcast.description}</Text>}
          <Flex alignItems="center">
            <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
              Tags: {podcast.tags.join(", ")}
            </Text>
          </Flex>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            {podcast.rating}/10
          </Text>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            {podcast.episodes.length} Episodes
          </Text>
        </Flex>
      </Flex>
      {/* Manage Section */}
      <Flex alignItems="center">
        <Box>
          <Tooltip label="Manage" aria-label="Manage Tooltip">
            <IconButton
              variant="ghost"
              fontSize={isMobile ? "2xl" : "3xl"}
              mr={isMobile ? 1 : 5}
              rounded={"full"}
              opacity={0.7}
              color={colorMode === "dark" ? "white" : "black"}
              aria-label="Manage Podcast"
              icon={<Icon as={MdSettings} />}
              onClick={() => handleManagePodcast(podcast.id, podcast.name)}
            />
          </Tooltip>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MyPodcast;
