import { useEffect, useState } from "react";
import {
  Flex,
  Tooltip,
  useBreakpointValue,
  Text,
  Icon,
  Button,
  VStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  IconButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaFileLines, FaLinesLeaning } from "react-icons/fa6";
import EditEpisodeForm from "./EditEpisode";
import PodcastHelper from "../../helpers/PodcastHelper";
import ManageSections from "./ManageSections";
import ManageTranscript from "./ManageTranscript";
import { convertTime } from "../../utilities/commonUtils";
import { FaList, FaCaretSquareRight } from "react-icons/fa";
import AnnotationForm from "../annotations/AnnotationForm";
import AnnotationList from "../annotations/AnnotationList";
import AnnotationHelper from "../../helpers/AnnotationHelper";
import HighlightForm from "../highlights/highlightForm";
import HighlightList from "../highlights/HighlightList";
import HighlightHelper from "../../helpers/HighlightHelper";
import { BsExplicitFill } from "react-icons/bs";
import {Like , Plays , Time } from "../../public/icons"
import { useTranslation } from 'react-i18next';

// Component to render an episode
const Episode = ({ episode }) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [annotations, setAnnotations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [episodes, setEpisode] = useState(null);
  const [highlights, setHighlights] = useState([]);

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
          console.error("Failed to fetch annotations:", response.message);
        }
      } catch (error) {
        console.error("Error fetching annotations:", error);
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
        console.log("Annotation deleted successfully");
      } else {
        console.error("Failed to delete annotation:", response.message);
      }
    } catch (error) {
      console.error("Error deleting annotation:", error);
    }
    setAnnotations((prevAnnotations) => prevAnnotations.filter((ann) => ann.id !== annotationId));
  };


  // Highlights
  const fetchHighlights = async () => {
    try {
      const fetchedHighlights = await HighlightHelper.getEpisodeHighlights(episode.id);
      setHighlights(fetchedHighlights);
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
      // Handle error (e.g., set error state, show toast notification, etc.)
    }
  };

  useEffect(() => {
    fetchHighlights(); // Initial fetch when the component mounts or the episode.id changes
  }, [episode.id]);

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

  // Transcript Modal
  //----------------------------------------------------------------------

  // State for managing modal visibility and the current episode for transcripts
  const [isModalTranscriptOpen, setIsModalTranscriptOpen] = useState(false);

  // Function to open the transcript modal
  const openTranscriptModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalTranscriptOpen(true);
  };

  // Function to close the transcript modal
  const closeTranscriptModal = () => {
    setIsModalTranscriptOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // Highlights Modal
  //----------------------------------------------------------------------
  const [isModalHighlightsOpen, setIsModalHighlightsOpen] = useState(false);

  // Function to open the highlights modal
  const openHighlightsModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalHighlightsOpen(true);
  };

  // Function to close the highlights modal
  const closeHighlightsModal = () => {
    setIsModalHighlightsOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // For delete pop up
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { isOpen: isAnnotationDrawerOpen, onOpen: onOpenAnnotationDrawer, onClose: onCloseAnnotationDrawer } = useDisclosure();
  const { isOpen: isHighlightDrawerOpen, onOpen: onOpenHighlightDrawer, onClose: onCloseHighlightDrawer } = useDisclosure();
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
      setEpisodeError(t('edit.errorDeletingEpisode'));
    }
    onCloseDeleteModal();
    setDeleting(false);
  };

  return (
    <Flex py={3}  mt={3} width="100%" borderRadius="15px" bg="az.darkGrey"  boxShadow="sm" style={{ cursor: "pointer" }} onClick={() => console.log(episode.id, episode.name)}>
      <Box position="relative" mr={3}>
        <Image boxSize={isMobile ? "0px" : "80px"} src={episode.thumbnailUrl} borderRadius="10px" marginLeft={isMobile ? "0px" : "3"}  />
      </Box>
      <VStack align={"right"} flex={1}>
        {/* Episode Name */}
        
        <Flex direction="column">
        <Text fontWeight="bold" fontSize={isMobile ? "md" : "xl"} data-cy={`episode-metric-${episode.episodeName}-likes:${episode.likes}`}>
          {episode.episodeName}
          {episode.isExplicit && <Icon as={BsExplicitFill} boxSize={isMobile ? "10px" : "16px"} ml={4} />}
        </Text>
          {isMobile ? null : <Text color="az.greyish" fontSize="md" mt={-2} >{episode.description}</Text>}
        </Flex>
        <HStack mt={-1} >
          <HStack spacing={1}>
            <Icon as={Plays} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
            {episode.playCount}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={Like } color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
            {episode.likes}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={Time } color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
            {convertTime(episode.duration)}
            </Text>
          </HStack>
        </HStack>

        {/* Episode Details */}
       
      </VStack>

      {/* Edit and Delete Buttons */}
      <HStack spacing={0} mr={3}>
        
          <Tooltip label={t('edit.highlights')} aria-label="Highlights Tooltip">
            <IconButton
              variant="minimal"
              data-cy="highlights-button"
              fontSize="md"
              rounded={"full"}
              opacity={0.7}
              color="white"
              aria-label="Edit Highlights"
              icon={<Icon as={FaCaretSquareRight} />}
              onClick={() => openHighlightsModal(episode)}
            />
          </Tooltip>
          <Tooltip label={t('edit.annotations')} aria-label="Annotations Tooltip">
            <IconButton
              variant="minimal"
              data-cy="annotations-button"
              fontSize="md"
              
              rounded={"full"}
              opacity={0.7}
              color="white"
              aria-label="Edit Annotations"
              icon={<Icon as={FaList} />}
              onClick={() => handleOpenForm(episode)}
            />
          </Tooltip>
          <Tooltip label={t('edit.sections')} aria-label="Sections Tooltip">
            <IconButton
              variant="minimal"
              data-cy="sections-button"
              fontSize="md"
              
              rounded={"full"}
              opacity={0.7}
              color="white"
              aria-label="Edit Sections"
              icon={<Icon as={FaLinesLeaning} />}
              onClick={() => openSectionsModal(episode)}
            />
          </Tooltip>
          <Tooltip label={t('edit.transcript')} aria-label="Transcript Tooltip">
            <IconButton
              variant="minimal"
              data-cy="transcript-button"
              fontSize="md"
             
              rounded={"full"}
              opacity={0.7}
              color="white"
              aria-label="Edit Transcript"
              icon={<Icon as={FaFileLines} />}
              onClick={() => openTranscriptModal(episode)}
            />
          </Tooltip>
          <Tooltip label={t('edit.edit')} aria-label="Edit Tooltip">
            <IconButton variant="minimal" data-cy="edit-button" fontSize="md" rounded={"full"} opacity={0.7} color="white" aria-label="Edit Episode" icon={<Icon as={MdEdit} />} onClick={() => openEditEpisodeModal(episode)} />
          </Tooltip>
          <Tooltip label={t('edit.delete')} aria-label="Delete Tooltip">
            <IconButton variant="minimal" data-cy="delete-button" fontSize="md" rounded={"full"} opacity={0.7}  color="white" aria-label="Delete Episode" icon={<Icon as={MdDelete} />} onClick={onOpenDeleteModal} />
          </Tooltip>
       
      </HStack>

      {/* Delete Episode Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('edit.confirmDeletion')}</ModalHeader>
          <ModalBody>
            {t('edit.areYouSureToDelete', { episodeName: episode.episodeName })}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCloseDeleteModal}>
              {t('edit.cancel')}
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => handleDelete(episode.episodeId)}>
              {t('edit.delete')}
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
                <Text>{t('edit.editEpisode', { episodeName: currentEpisode?.episodeName })}</Text>

                <EditEpisodeForm episode={episode} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalSectionsOpen} onClose={closeSectionsModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent minWidth={"50%"} padding={"2em"}>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack align="center" backgroundColor={"transparent"}>
                <Text>{t('edit.manageSections', { episodeName: currentEpisode?.episodeName })}</Text>
                <ManageSections episodeId={episode.id} podcastId={episode.podcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>


      <Modal isOpen={isModalTranscriptOpen} onClose={closeTranscriptModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent minWidth={"50%"} padding={"2em"}>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack align="center" backgroundColor={"transparent"}>
                <Text>{t('edit.manageTranscript', { episodeName: currentEpisode?.episodeName })}</Text>
                {/* Assuming there's a component for managing transcripts similar to ManageSections */}
                <ManageTranscript episodeId={episode.id} podcastId={episode.podcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalHighlightsOpen} onClose={closeHighlightsModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent minWidth={"50%"} padding={"2em"}>
          <ModalCloseButton />
          <ModalHeader>{t('edit.highlights')}</ModalHeader>
          <ModalBody>
            <Tabs isFitted variant="enclosed" colorScheme="blue" defaultIndex={tabIndex} onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>{t('edit.addHighlight')}</Tab>
                <Tab>{t('edit.highlights')}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <HighlightForm episodeId={episode.id} highlightId={null} fetchHighlights={fetchHighlights} episodeLength={episode.duration} podcastId={episode.podcastId} />
                </TabPanel>
                <TabPanel>
                  <HighlightList episodeId={episode.id} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAnnotationDrawerOpen} onClose={onCloseAnnotationDrawer}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('edit.annotations')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed" colorScheme="blue" defaultIndex={tabIndex} onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>{t('edit.annotations')}</Tab>
                <Tab>{t('edit.addAnnotation')}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AnnotationList annotations={annotations} deleteAnnotation={handleDeleteAnnotation} />
                </TabPanel>
                <TabPanel>
                  {/* Pass the episode duration to the AnnotationForm */}
                  <AnnotationForm episodeId={episode.id} fetchAnnotations={fetchAnnotations} episodeLength={episode.duration} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Episode;
