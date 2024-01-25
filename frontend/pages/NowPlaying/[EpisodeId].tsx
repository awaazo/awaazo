import { useState, useEffect } from "react";

import { Box, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Tabs, TabList, TabPanels, Tab, TabPanel, useBreakpointValue, Grid, DrawerCloseButton, Spinner} from "@chakra-ui/react";
import { FaPlus, FaList } from 'react-icons/fa';
import CoverArt from "../../components/nowPlaying/CoverArt";
import Sections from "../../components/nowPlaying/Sections";
import PodCue from "../../components/nowPlaying/PodCue";
import Transcripts from "../../components/nowPlaying/Transcripts";
import Bookmarks from "../../components/nowPlaying/Bookmarks";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PodcastHelper from "../../helpers/PodcastHelper";
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
  const [annotations, setAnnotations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  
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
      const fetchEpisode = async () => {
        setIsLoading(true); // Start loading
        try {
          if (EpisodeId) {
            const response = await PodcastHelper.getEpisodeById(EpisodeId);
            if (response.status === 200) {
              setEpisode(response.episode);
            } else {
              console.error("Error fetching episode data:", response.message);
              // Set error state here if needed
            }
          }
          fetchAnnotations();
        } catch (error) {
          console.error("Error fetching episode data:", error);
          // Set error state here
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
    
      fetchEpisode();
    }, [EpisodeId]);
    
  

  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    

  const handleDeleteAnnotation = async (annotationId) => {
    try {
      const response = await AnnotationHelper.deleteAnnotationRequest(annotationId);
      if (response.status === 200) {
        console.log('Annotation deleted successfully');
      } else {
        console.error('Failed to delete annotation:', response.message);
      }
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
    setAnnotations(prevAnnotations => prevAnnotations.filter(ann => ann.id !== annotationId));
  };


  useEffect(() => {
    if (episode) {
      setComponents([
        {
          component: <CoverArt episodeId={episode.id} />,
          inSlider: false,
        },
        {
          component: <Transcripts episodeId={episode.id} />,
          inSlider: true,
        },
        // { component: <AwaazoBirdBot />, inSlider: false },
        {
          component: <Sections episodeId={episode.id} />,
          inSlider: true,
        },
        {
          component: <Bookmarks episodeId={episode.id} />,
          inSlider: true,
        },
        {
          component: <PodCue cues={annotations} />, 
          inSlider: false, 
        },

        // DO NOT REMOVE
      ]);
    }
  }, [episode, annotations]);

  // const palette = usePalette(episode.thumbnailUrl, 2, "hex", {
  //   crossOrigin: "Anonymous",
  //   quality: 10,
  // }).data;

  const handleComponentClick = (index: number) => {
    setSelectedComponent(index === selectedComponent ? null : index);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });



  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
          {/* If isLoading is true, display the Spinner */}
    {isLoading && (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
      </Box>
    )}
      {/* //bgColor={palette || null} */}
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
      

  </Box>
);
};

export default NowPlaying;