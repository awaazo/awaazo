import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Text,
  Collapse,
  Tag,
  SimpleGrid,
  VStack,
  Image,
  HStack,
  Wrap,
  WrapItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  Icon,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import { MdEdit } from "react-icons/md";

import EditPodcastForm from "../myPodcast/EditPodcastForm";
import MyEpisodes from "../myPodcast/MyEpisodes";

export default function PodcastOverview({ podcast }) {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box
        p={4}
        mt={"2em"}
        borderRadius="1em"
        padding={"2em"}
        dropShadow={" 0px 4px 4px rgba(0, 0, 0, 0.35)"}
        minHeight={"200px"}
      >
        <Flex align="center" justify="center">
          <Image
            boxSize={isMobile ? "125px" : "0px"}
            src={podcast.coverArtUrl}
            borderRadius="10%"
            marginLeft={isMobile ? "0px" : "20px"}
            mt={1}
          />
        </Flex>

        <Flex paddingTop={5} width="100%" boxShadow="sm">
          <Box position="relative" mr={5}>
            <Image
              boxSize={isMobile ? "0px" : "180px"}
              src={podcast.coverArtUrl}
              borderRadius="10%"
              marginLeft={isMobile ? "0px" : "20px"}
              mt={1}
            />
          </Box>
          <Flex direction="column" flex={1} style={{ paddingTop: "20px" }}>
            {/* Episode Name */}

            <Text fontSize="xl" fontWeight="bold">
              <Wrap align="center" spacing={4}>
                <WrapItem>🎙️ {podcast.name}</WrapItem>
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
                      borderRadius="10em"
                    >
                      <Text fontSize="md">{tag}</Text>
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </Text>
            {/* Episode Details */}
            <Flex direction="column" fontSize="sm">
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "larger",
                  paddingTop: "10px",
                }}
              >
                {podcast.description}
              </Text>
              <Text
                fontSize={isMobile ? "md" : "md"}
                style={{ paddingTop: "10px" }}
              >
                {podcast.totalRatings === 0 ? (
                  "This podcast has no ratings yet"
                ) : (
                  <Tag
                    size="sm"
                    colorScheme={
                      podcast.averageRating <= 2.4
                        ? "red"
                        : podcast.averageRating <= 3.5
                        ? "yellow"
                        : "green"
                    }
                    fontSize={isMobile ? "10px" : "md"}
                  >
                    {`${podcast.averageRating.toFixed(1)} / 5 (${
                      podcast.totalRatings
                    } ratings)`}
                  </Tag>
                )}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {isMobile ? (
          <Box>
            <Text
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "1em",
                padding: "1em",
                outline: "2px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "0.5em",
                marginTop: "1em",
                wordBreak: "break-word",
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
                marginTop: "1em",
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  fontSize="md"
                  style={{ fontWeight: "bold", paddingLeft: 15 }}
                >
                  Episodes:
                </Text>{" "}
              </div>

              {podcast.episodes.length === 0 ? (
                <Text
                  align={"center"}
                  fontSize="md"
                  style={{
                    fontWeight: "normal",
                    marginTop: "2em",
                  }}
                >
                  (This podcast has no episodes yet)
                </Text>
              ) : (
                podcast.episodes.map((episode, index) => (
                  <MyEpisodes episode={episode} key={index} />
                ))
              )}
            </>
          </Box>
        ) : (
          <Flex justify="space-between" align="start">
            {/* Sidebar on the left */}
            <Box
              p={4}
              mt={"0.5em"}
              width={"30%"}
              padding={"1em"}
              _focus={{
                boxShadow: "none",
                outline: "none",
              }}
            >
              {/* Description and statistics */}
              <Text
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "1em",
                  padding: "2em",
                  outline: "2px solid rgba(255, 255, 255, 0.1)",
                  marginBottom: "0.5em",
                  marginTop: "1em",
                  wordBreak: "break-word",
                }}
              >
                {podcast.description}
              </Text>
              <Box
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "1em",
                  padding: "2em",
                  marginTop: "1em",
                  outline: "2px solid rgba(255, 255, 255, 0.1)",
                  marginBottom: "2em",
                  wordSpacing: "0.5em",
                }}
              >
                {/* Podcast statistics */}
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
            </Box>

            {/* Podcast mapping on the right */}
            <div style={{ flex: 1, paddingLeft: 25, marginTop: "1.5em" }}>
              {podcast.episodes.length === 0 ? (
                <Text
                  align={"center"}
                  fontSize="lg"
                  style={{
                    fontWeight: "normal",
                    marginTop: "5em",
                  }}
                >
                  (This podcast has no episodes yet)
                </Text>
              ) : (
                podcast.episodes.map((episode, index) => (
                  <MyEpisodes episode={episode} key={index} />
                ))
              )}
            </div>
          </Flex>
        )}
      </Box>
    </>
  );
}
