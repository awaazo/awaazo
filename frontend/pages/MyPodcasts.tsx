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
import MyPodcast from "../components/myPodcast/MyPodcast";
import { UserMenuInfo, Podcast } from "../utilities/Interfaces";
import router from "next/router";
import AuthHelper from "../helpers/AuthHelper";
import PodcastHelper from "../helpers/PodcastHelper";

const MyPodcasts = () => {
  // Page refs
  const loginPage = "/auth/Login";
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
            setSelectedPodcastId(
              res2.myPodcasts.length > 0 ? res2.myPodcasts[0].id : null,
            );
          } else {
            setCreateError("Podcasts cannot be fetched");
          }
        });
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

  // Function to navigate to create podcast page
  const navigateToCreatePodcast = () => {
    router.push("/NewPodcast");
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

        <Flex justify="center" pb={5}>
          <HStack spacing={5}>
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
                <Text fontSize="lg">
                  {podcast.name.length > 18
                    ? `${podcast.name.substring(0, 18)}...`
                    : podcast.name}
                </Text>
              </VStack>
            ))}
          </HStack>
          <Flex
            direction="column"
            alignItems="center"
            borderRadius="1em"
            cursor="pointer"
            outline="none"
            onClick={navigateToCreatePodcast}
            p={2}
            m={2}
            bg="transparent"
          >
            <Box
              boxSize="150px"
              marginLeft="10px"
              borderRadius="2em"
              border="2px dashed gray"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <AddIcon w={10} h={10} />
            </Box>
            <Text mt={2}>Create a Podcast</Text>
          </Flex>
        </Flex>
        {selectedPodcastId !== null && (
          <MyPodcast podcastId={selectedPodcastId} />
        )}
      </Box>
    </>
  );
};

export default MyPodcasts;