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

import EditPodcastForm from "../myPodcast/EditPodcastForm";
import MyEpisodes from "../myPodcast/MyEpisodes";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Episode } from "../../utilities/Interfaces";

export default function MyPodcast({ podcastId }) {
  useEffect(() => {
    PodcastHelper.getPodcastById(podcastId).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setCoverImage(res.podcast.coverArtUrl);
        setPodcastName(res.podcast.name);
        setDescription(res.podcast.description);
        setTags(res.podcast.tags);
        setEpisodes(res.podcast.episodes);
      } else {
        setCreateError("Podcasts cannot be fetched");
      }
    });
  }, [podcastId]);
  // Page refs
  const MyPodcastsPage = "/MyPodcasts";
  const { colorMode } = useColorMode();

  // Form Values
  const [coverImage, setCoverImage] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [tags, setTags] = useState([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [description, setDescription] = useState("");

  // Form errors
  const [createError, setCreateError] = useState("");

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Handle Deletion of podcast
  const handleDelete = async () => {
    setDeleting(true);
    // Create request object
    const response = await PodcastHelper.deletePodcast(podcastId);
    console.log(response);
    if (response.status == 200) {
      window.location.href = MyPodcastsPage;
    } else {
      setCreateError("Podcasts cannot be deleted");
    }
    onClose();
    setDeleting(false);
  };

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
                🎙️ {podcastName}
              </Text>
            </WrapItem>

            {/* Display tags */}
            {tags.map((tag, index) => (
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
            <IconButton
              onClick={onOpen}
              disabled={isDeleting}
              variant="ghost"
              size="lg"
              rounded={"full"}
              opacity={0.7}
              mr={3}
              color={colorMode === "dark" ? "red" : "red"}
              aria-label="Delete"
            >
              <DeleteIcon w={6} h={6} />
            </IconButton>
          </div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete the podcast "{podcastName}".{" "}
                <br />
                This action cannot be undone
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
          {description}
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
          {episodes.map((episode, index) => (
            <MyEpisodes episode={episode} />
          ))}
          {episodes.map((episode, index) => (
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
                    onClick={() => console.log("edit")}
                    style={{
                      borderRadius: "3em",
                      colorScheme: "blue",
                      fontSize: "0.9em",
                    }}
                  >
                    Edit Episode
                  </Button>
                  <Button
                    colorScheme="red"
                    leftIcon={<DeleteIcon style={{ marginLeft: "5px" }} />}
                    onClick={onOpen}
                    isLoading={isDeleting}
                  ></Button>
                </HStack>
                <Text marginBottom={"2em"}>{episode.description}</Text>
              </VStack>
            </Box>
          ))}
        </>
      </VStack>
      ;{/* Modal for editing a podcast */}
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
                <Text>Edit Podcast: {podcastName}</Text>
                <EditPodcastForm podcastId={podcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      ;
    </>
  );
}
