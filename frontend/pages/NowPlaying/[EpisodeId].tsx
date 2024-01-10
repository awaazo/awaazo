import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  Grid,
  DrawerCloseButton
} from "@chakra-ui/react";
import { FaPlus, FaList } from 'react-icons/fa';
import Navbar from "../../components/shared/Navbar";
import AwaazoBirdBot from "../../components/nowPlaying/AwaazoBirdBot";
import Bookmarks from "../../components/nowPlaying/Bookmarks";
import Transcripts from "../../components/nowPlaying/Transcripts";
import CoverArt from "../../components/nowPlaying/CoverArt";
import Sections from "../../components/nowPlaying/Sections";
import PodCue from "../../components/nowPlaying/PodCue";
import AnnotationForm from "../../components/nowPlaying/AnnotationForm";
import AnnotationList from "../../components/nowPlaying/AnnotationList";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PodcastHelper from "../../helpers/PodcastHelper";
import { usePalette } from "color-thief-react";
import { sliderSettings } from "../../utilities/commonUtils";
import { useRouter } from "next/router";
import AnnotationHelper from "../../helpers/AnnotationHelper";

const NowPlaying = () => {
  const router = useRouter();
  const { EpisodeId } = router.query;
  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(
    null,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);


    // Function to open drawer to the list of annotations
    const handleOpenList = () => {
      setTabIndex(0);
      onOpen();
    };
  
    // Function to open drawer to the add/edit form
    const handleOpenForm = (index = null) => {
      setTabIndex(1);
      if (index !== null) {
        setSelectedAnnotation({ ...annotations[index], index });
      } else {
        setSelectedAnnotation(null);
      }
      onOpen();
    };


    const fetchAnnotations = async () => {
      if (EpisodeId) {
        try {
          const response = await AnnotationHelper.getAnnotationsRequest(EpisodeId);
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
    if (EpisodeId) {
      PodcastHelper.getEpisodeById(EpisodeId)
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
  }, [EpisodeId]);
  
  let dynamicType = "sponsorship"; // Imagine this is set dynamically somehow
 

  
  
  const [annotations, setAnnotations] = useState();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  



  const handleSaveAnnotation = async (annotationData) => {
    // Determine which helper method to use based on the annotation type
    try {
      let response;
      if (annotationData.type === 'mediaLink') {
        response = await AnnotationHelper.mediaLinkAnnotationCreateRequest(annotationData, EpisodeId);
      } else if (annotationData.type === 'sponsor') {
        response = await AnnotationHelper.sponsorAnnotationCreateRequest(annotationData, EpisodeId);
      } else {
        response = await AnnotationHelper.annotationCreateRequest(annotationData, EpisodeId);
      }

      if (response.status === 200) {
        fetchAnnotations(); // Refresh the annotations list
        onClose(); // Close the form
      } else {
        console.error('Failed to save annotation:', response.message);
      }
    } catch (error) {
      console.error('Error saving annotation:', error);
    }
  };

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
  };


  useEffect(() => {
    if (episode) {
      setComponents([
        {
          component: <CoverArt episodeId={episode.id} />,
          inSlider: false,
        },
        // { component: <AwaazoBirdBot />, inSlider: false },
        // {
        //   component: <Bookmarks episodeId={episode.id}  />,
        //   inSlider: true,
        // },
        // {
        //   component: <Transcripts episodeId={episode.id}  />,
        //   inSlider: true,
        // },
        {
          component: <Sections episodeId={episode.id} />,
          inSlider: true,
        },
        {
          component: <PodCue cues={[]} />,
          inSlider: false, // Adjust based on your design
        },

        // DO NOT REMOVE
      ]);
    }
  }, [episode]);

  // const palette = usePalette(episode.thumbnailUrl, 2, "hex", {
  //   crossOrigin: "Anonymous",
  //   quality: 10,
  // }).data;

  const handleComponentClick = (index: number) => {
    setSelectedComponent(index === selectedComponent ? null : index);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const sliderComponents = components.filter((comp) => comp.inSlider);
  const [isAnnotationListOpen, setIsAnnotationListOpen] = useState(false);



  function handleToggleList(): void {
    setIsAnnotationListOpen(!isAnnotationListOpen);
  }

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* //bgColor={palette || null} */}
      <Navbar />
      {isMobile ? (
        <Slider {...sliderSettings}>
          {components.map((comp, index) => (
            <Box
              key={index}
              w="full"
              h="80vh"
              p={4}
              alignItems="stretch"
              justifyContent="center"
            >
              {comp.component}
            </Box>
          ))}
        </Slider>
      ) : (
        <Box flexGrow={1} pl={3} pr={3} mx={5} overflow="hidden">
          <Grid
            templateAreas={{
              md: `
              "coverart transcripts AwaazoBirdBot"
              "bookmarks sections AwaazoBirdBot"
            `,
            }}
            gridTemplateRows={{ md: "1fr 1fr" }}
            gridTemplateColumns={{ md: "1fr 1fr 1fr" }}
            gap={1}
            h="calc(100% - 400px)"
          >
            {components.map((comp, index) => (
              <Box
                key={index}
                gridArea={comp.gridArea}
                p={2}
                onClick={() => handleComponentClick(index)}
              >
                {comp.component}
              </Box>
            ))}
          </Grid>
        </Box>
      )}
      
      <IconButton
        icon={<FaList />}
        isRound
        size="lg"
        colorScheme="teal"
        position="fixed"
        bottom="160px"
        right="25px"
        zIndex="overlay"
        onClick={handleOpenList}
        aria-label="List annotations"
      />

      <IconButton
        icon={<FaPlus />}
        isRound
        size="lg"
        colorScheme="teal"
        position="fixed"
        bottom="100px"
        right="25px"
        zIndex="overlay"
        onClick={() => handleOpenForm()}
        aria-label="Add annotation"
      />

      {/* Unified Drawer for Annotations */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      {/* Drawer contents */}
      <DrawerBody>
        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabPanels>
            <TabPanel>
              <AnnotationList annotations={annotations} editAnnotation={handleOpenForm} deleteAnnotation={handleDeleteAnnotation} />
            </TabPanel>
            <TabPanel>
              <AnnotationForm annotation={selectedAnnotation} saveAnnotation={handleSaveAnnotation} episodeId={EpisodeId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DrawerBody>
    </Drawer>
  </Box>
);
};

export default NowPlaying;