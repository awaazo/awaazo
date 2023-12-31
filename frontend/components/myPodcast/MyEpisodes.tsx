import { useState } from "react";
import { Box, Flex, IconButton, Tag, Tooltip, useDisclosure, useBreakpointValue, Text, Icon, Button, VStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaLinesLeaning } from "react-icons/fa6";
import EditEpisodeForm from "../myPodcast/EditEpisodeForm";
import PodcastHelper from "../../helpers/PodcastHelper";
import ManageSections from "./ManageSections";
import { convertTime } from "../../utilities/commonUtils";

// Component to render an episode
const Episode = ({ episode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Edit Episode Modal
  //-----------------------------------------------------------------------

  // State for managing modal visibility and the current episode
  const [isModalEpisodeOpen, setIsModalEpisodeOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Function to open the edit episode modal
  const openEditEpisodeModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalEpisodeOpen(true);
  };

  // Function to close the edit episode modal
  const closeEditEpisodeModal = () => {
    setIsModalEpisodeOpen(false);
    setCurrentEpisode(null);
  };
  //-----------------------------------------------------------------------

  // Sections Modal
  //----------------------------------------------------------------------

  // State for managing modal visibility and the current episode
  const [isModalSectionsOpen, setIsModalSectionsOpen] = useState(false);

  // Function to open the edit episode modal
  const openSectionsModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalSectionsOpen(true);
  };

  // Function to close the edit episode modal
  const closeSectionsModal = () => {
    setIsModalSectionsOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Form errors
  const [episodeError, setEpisodeError] = useState("");

  // Function to handle deletion of the episode
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
    <Flex paddingTop={5} paddingBottom={5} mt={3} width="100%" borderRadius="15px" bg="rgba(255, 255, 255, 0.1)" backdropFilter="blur(4px)" boxShadow="sm" style={{ cursor: "pointer" }} onClick={() => console.log(episode.id, episode.name)}>
      <Box position="relative" mr={5}>
        <Image boxSize={isMobile ? "0px" : "125px"} src={episode.thumbnailUrl} borderRadius="10%" marginLeft={isMobile ? "0px" : "20px"} mt={1} />
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"} data-cy={`episode-metric-${episode.episodeName}-likes:${episode.likes}`}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Tag size="sm" colorScheme="red" fontSize={isMobile ? "10px" : "sm"}>
              Explicit
            </Tag>
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
          <Text fontSize={isMobile ? "md" : "md"}>❤️ {episode.likes} </Text>
        </Text>
        {/* Episode Details */}
        <Flex direction="column" fontSize="sm" color="gray.500">
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {convertTime(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start">
        <Box>
          <Tooltip label="Sections" aria-label="Sections Tooltip">
            <IconButton
              variant="ghost"
              data-cy="sections-button"
              fontSize={isMobile ? "md" : "lg"}
              mr={1}
              rounded={"full"}
              opacity={0.7}
              color="white"
              aria-label="Edit Sections"
              icon={<Icon as={FaLinesLeaning} />}
              onClick={() => openSectionsModal(episode)}
            />
          </Tooltip>
          <Tooltip label="Edit" aria-label="Edit Tooltip">
            <IconButton variant="ghost" data-cy="edit-button" fontSize={isMobile ? "md" : "lg"} mr={1} rounded={"full"} opacity={0.7} color="white" aria-label="Edit Episode" icon={<Icon as={MdEdit} />} onClick={() => openEditEpisodeModal(episode)} />
          </Tooltip>
          <Tooltip label="Delete" aria-label="Delete Tooltip">
            <IconButton variant="ghost" data-cy="delete-button" fontSize={isMobile ? "md" : "lg"} rounded={"full"} opacity={0.7} marginRight={5} color="white" aria-label="Delete Episode" icon={<Icon as={MdDelete} />} onClick={onOpen} />
          </Tooltip>
        </Box>
      </Flex>

      {/* Delete Episode Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the episode "{episode.episodeName}". <br />
            This action cannot be undone
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => handleDelete(episode.episodeId)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Episode Modal */}
      <Modal isOpen={isModalEpisodeOpen} onClose={closeEditEpisodeModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent boxShadow="dark-lg" backdropFilter="blur(40px)" display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop={"10%"} padding={"2em"}>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack spacing={5} align="center" backgroundColor={"transparent"}>
                <Text>Edit Episode: {currentEpisode?.episodeName}</Text>

                <EditEpisodeForm episode={episode} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalSectionsOpen} onClose={closeSectionsModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
          bg={"rgba(0, 0, 0, 0.3)"}
          backdropFilter="blur(10px)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minWidth={"40%"}
          marginTop={"10%"}
          padding={"2em"}
          border="3px solid rgba(255, 255, 255, 0.05)"
          borderRadius="3xl"
        >
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack align="center" backgroundColor={"transparent"}>
                <Text>Manage Sections: {currentEpisode?.episodeName}</Text>

                <ManageSections episodeId={episode.id} podcastId={episode.podcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Episode;
