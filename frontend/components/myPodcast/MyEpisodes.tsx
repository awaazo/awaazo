import { useEffect, useState } from "react";
import {  Flex, Tag, Tooltip, useBreakpointValue, Text, Icon, Button, VStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, IconButton, useDisclosure, Tabs, TabList, TabPanels, Tab,TabPanel} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaLinesLeaning } from "react-icons/fa6";
import EditEpisodeForm from "../myPodcast/EditEpisodeForm";
import PodcastHelper from "../../helpers/PodcastHelper";
import ManageSections from "./ManageSections";
import { convertTime } from "../../utilities/commonUtils";
import { FaPlus, FaList } from 'react-icons/fa';
import AnnotationForm from "../annotations/AnnotationForm";
import AnnotationList from "../annotations/AnnotationList";
import AnnotationHelper from "../../helpers/AnnotationHelper";


// Component to render an episode
const Episode = ({ episode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [annotations, setAnnotations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [episodes, setEpisode] = useState(null);

  const handleOpenForm = (index = null) => {
    setTabIndex(1);
    if (index !== null) {
      setSelectedAnnotation({ ...annotations[index], index });
    } else {
      setSelectedAnnotation(null);
    }
    onOpenAnnotationDrawer();
  };


  const fetchAnnotations = async () => {
    if (episode.id) {
      try {
        const response = await AnnotationHelper.getAnnotationsRequest(episode.id);
        if (response.status === 200) {
          setAnnotations(response.annotations);
        } else {
          console.error('Failed to fetch annotations:', response.message);
        }
      } catch (error) {
        console.error('Error fetching annotations:', error);
      }
    }
  };

  useEffect(() => {
    if (episode.id) {
      PodcastHelper.getEpisodeById(episode.id)
      .then((response) => {
        if (response.status === 200) {
          setEpisode(response.episode);
        } else {
          console.error("Error fetching episode data:", response.message);
        }
      })
      .catch((error) => console.error("Error fetching episode data:", error));
    }
    fetchAnnotations();
  }, [episode.id]);

    const handleDeleteAnnotation = async (annotationId) => {
      try {
        const response = await AnnotationHelper.deleteAnnotationRequest(annotationId);
        if (response.status === 200) {
          // Optionally refresh the annotations list after deletion
          // fetchAnnotations(); // This should be a function that fetches the updated list of annotations
          console.log('Annotation deleted successfully');
        } else {
          console.error('Failed to delete annotation:', response.message);
        }
      } catch (error) {
        console.error('Error deleting annotation:', error);
      }
      setAnnotations(prevAnnotations => prevAnnotations.filter(ann => ann.id !== annotationId));
    };

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
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { isOpen: isAnnotationDrawerOpen, onOpen: onOpenAnnotationDrawer, onClose: onCloseAnnotationDrawer } = useDisclosure();
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
    onCloseDeleteModal();
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
          <Tooltip label="Annotations" aria-label="Annotations Tooltip">
            <IconButton  variant="ghost" data-cy="annotations-button" fontSize={isMobile ? "md" : "lg"} mr={1} rounded={"full"} opacity={0.7} color="white" aria-label="Edit Annotations" icon={<Icon as={FaList} />} onClick={() => handleOpenForm (episode)} />
          </Tooltip>
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
            <IconButton variant="ghost" data-cy="delete-button" fontSize={isMobile ? "md" : "lg"} rounded={"full"} opacity={0.7} marginRight={5} color="white" aria-label="Delete Episode" icon={<Icon as={MdDelete} />} onClick={onOpenDeleteModal} />
          </Tooltip>
        </Box>
      </Flex>
      

      {/* Delete Episode Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the episode "{episode.episodeName}". <br />
            This action cannot be undone
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCloseDeleteModal}>
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
          minWidth={"50%"}
          padding={"2em"}
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

      <Modal isOpen={isAnnotationDrawerOpen} onClose={onCloseAnnotationDrawer}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Annotations</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs
            isFitted
            variant="enclosed"
            defaultIndex={tabIndex}
            onChange={index => setTabIndex(index)}
          >
            <TabList >
              <Tab color = "brand.200" _selected={{ color: "brand.300" }}>Annotations</Tab>
              <Tab color = "brand.200" _selected={{ color: "brand.300" }}>Add Annotation</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AnnotationList annotations={annotations} editAnnotation={handleOpenForm} deleteAnnotation={handleDeleteAnnotation} />
              </TabPanel>
              <TabPanel>
                <AnnotationForm episodeId={episode.id} fetchAnnotations={fetchAnnotations} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>   
      </ModalContent>
    </Modal>
    </Flex>
  );
};

export default Episode;
