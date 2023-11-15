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
  const CreatePage = "/Create";
  const { colorMode } = useColorMode();

  // Form Values
  const [coverImage, setCoverImage] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [tags, setTags] = useState([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [description, setDescription] = useState("");

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Form errors
  const [createError, setCreateError] = useState("");

  //
  const navigateToCreatePage = () => {
    window.location.href = CreatePage;
  };

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
      <Box
        p={4}
        mt={"2em"}
        borderWidth="1px"
        borderRadius="1em"
        padding={"1.5em"}
        bg={
          colorMode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)"
        }
        backdropFilter={"blur(50px)"}
        dropShadow={" 0px 4px 4px rgba(0, 0, 0, 0.35)"}
        minHeight={"200px"}
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
                  borderRadius="10em"
                >
                  <Text fontSize="md">{tag}</Text>
                </Box>
              </WrapItem>
            ))}
            <Button
              onClick={navigateToCreatePage}
              style={{
                fontWeight: "bold",
                marginLeft: "10px",
                borderRadius: "10em",
                borderColor: "rgba(158, 202, 237, 0.6)",
              }}
            >
              New Episode
            </Button>
          </Wrap>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {isMobile ? (
              <Box>
                <Tooltip label="Edit Podcast" aria-label="Edit Podcast Tooltip">
                  <IconButton
                    variant="ghost"
                    fontSize="lg"
                    rounded="full"
                    opacity={0.7}
                    color={colorMode === "dark" ? "white" : "black"}
                    aria-label="Edit Podcast"
                    icon={<Icon as={MdEdit} />}
                    onClick={() => openEditPodcastModal()}
                  />
                </Tooltip>
              </Box>
            ) : (
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
                  // boxShadow: "0 0 15px rgba(158, 202, 237, 0.6)",
                }}
              >
                Edit Podcast
              </Button>
            )}
            {/* Edit button */}
            <IconButton
              onClick={onOpen}
              disabled={isDeleting}
              variant="ghost"
              size={isMobile === true ? "sm" : "lg"}
              rounded={"full"}
              opacity={0.7}
              mr={3}
              color={colorMode === "dark" ? "red" : "red"}
              aria-label="Delete"
            >
              <DeleteIcon
                w={isMobile === true ? "5" : "6"}
                h={isMobile === false ? "5" : "6"}
                color={colorMode === "dark" ? "#FF6666" : "#FF0000"}
                data-cy={`podcast-delete`} // Adding a data-cy attribute to delete button
              />
            </IconButton>
          </div>
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
              {description}
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

              {episodes.length === 0 ? (
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
                episodes.map((episode, index) => (
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
                {description}
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
              {episodes.length === 0 ? (
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
                episodes.map((episode, index) => (
                  <MyEpisodes episode={episode} key={index} />
                ))
              )}
            </div>
          </Flex>
        )}
      </Box>
      {/* Modal for deleting a podcast */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the podcast "{podcastName}". <br />
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

      {/* Modal for editing a podcast */}
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
    </>
  );
}
