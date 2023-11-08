import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Tag,
  MenuGroup,
  Tooltip,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Text,
  Icon,
  Button,
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
import { MdEdit, MdDelete } from "react-icons/md";

import EditEpisodeForm from "../myPodcast/EditEpisodeForm";
import PodcastHelper from "../../helpers/PodcastHelper";

const Episode = ({ episode }) => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Edit Episode Modal
  //----------------------------------------------------------------------
  const [isEditEpisodeModalOpen, setIsEditEpisodeModalOpen] = useState(false);
  const [currentEditingEpisode, setCurrentEditingEpisode] = useState(null);

  // State for managing modal visibility and the current episode
  const [isModalEpisodeOpen, setIsModalEpisodeOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const openEditEpisodeModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalEpisodeOpen(true);
  };
  const closeEditEpisodeModal = () => {
    setIsModalEpisodeOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Form errors
  const [episodeError, setEpisodeError] = useState("");
  // Handle Deletion of podcast
  const handleDelete = async (episodeId) => {
    setDeleting(true);
    // Create request object
    const response = await PodcastHelper.deleteEpisode(episode.id);
    console.log(response);
    if (response.status == 200) {
      window.location.reload();
    } else {
      setEpisodeError("Episode cannot be deleted");
    }
    onClose();
    setDeleting(false);
  };

  return (
    <Flex
      p={4}
      mt={4}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      style={{ cursor: "pointer" }}
      onClick={() => console.log(episode.id, episode.name)}
    >
      <Box position="relative" mr={5}>
        <Image
          boxSize={isMobile ? "90px" : "125px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          mt={1}
        />
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Tag
              size="sm"
              colorScheme="red"
              fontSize={isMobile ? "10px" : "sm"}
            >
              Explicit
            </Tag>
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
          <Text fontSize={isMobile ? "md" : "md"}>❤️ {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          <Text>{episode.description}</Text>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {formatDuration(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start">
        <Box>
          <Tooltip label="Edit" aria-label="Edit Tooltip">
            <IconButton
              variant="ghost"
              fontSize={isMobile ? "2xl" : "3xl"}
              mr={isMobile ? 1 : 5}
              rounded={"full"}
              opacity={0.7}
              color={colorMode === "dark" ? "white" : "black"}
              aria-label="Edit Episode"
              icon={<Icon as={MdEdit} />}
              onClick={() => openEditEpisodeModal(episode)}
            />
          </Tooltip>
        </Box>
        <Box>
          <Tooltip label="Delete" aria-label="Delete Tooltip">
            <IconButton
              variant="ghost"
              fontSize={isMobile ? "2xl" : "3xl"}
              rounded={"full"}
              opacity={0.7}
              color={colorMode === "dark" ? "white" : "black"}
              aria-label="Delete Episode"
              icon={<Icon as={MdDelete} />}
              onClick={onOpen}
            />
          </Tooltip>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the episode "{episode.episodeName}".{" "}
            <br />
            This action cannot be undone
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => handleDelete(episode.episodeId)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalEpisodeOpen} onClose={closeEditEpisodeModal}>
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
                <Text>Edit Episode: {currentEpisode?.episodeName}</Text>

                <EditEpisodeForm episode={episode} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Episode;
