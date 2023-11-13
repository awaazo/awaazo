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

import EditPodcastForm from "../myPodcast/EditPodcastForm";
import Episode from "../explore/Episode";
import Reviews from "../explore/Reviews";

export default function PodcastOverview({ podcast }) {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box
        p={4}
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
            border={isMobile ? "3px solid rgba(255, 255, 255, 0.2)" : "0px"}
            mt={1}
          />
        </Flex>

        <Flex width="100%" boxShadow="sm">
          <Box position="relative" mr={5}>
            <Image
              boxSize={isMobile ? "0px" : "180px"}
              objectFit="cover"
              src={podcast.coverArtUrl}
              borderRadius="2em"
              marginLeft={isMobile ? "0px" : "20px"}
              mt={1}
              border={isMobile ? "0px" : "3px solid rgba(255, 255, 255, 0.2)"}
            />
          </Box>
          <Flex direction="column" flex={1} style={{ paddingTop: "10px" }}>
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
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Text
                  fontSize="md"
                  mt={10}
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
                  <Episode episode={episode} key={index} />
                ))
              )}
            </>
            <Box
              p={4}
              mt={"0.5em"}
              padding={"1em"}
              _focus={{
                boxShadow: "none",
                outline: "none",
              }}
            >
              <Reviews podcast={podcast} />
            </Box>
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
              <Reviews podcast={podcast} />
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
                  <Episode episode={episode} key={index} />
                ))
              )}
            </div>
          </Flex>
        )}
      </Box>
    </>
  );
}
