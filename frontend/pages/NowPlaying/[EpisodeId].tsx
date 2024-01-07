import { useState, useEffect } from "react";
import { Box, Button, Grid, useBreakpointValue, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton, VStack, IconButton  } from "@chakra-ui/react";
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
import { FaPlus } from "react-icons/fa";

const NowPlaying = () => {
  const router = useRouter();
  const { EpisodeId } = router.query;
  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(
    null,
  );

  
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
  }, [EpisodeId]);
  
  let dynamicType = "sponsorship"; // Imagine this is set dynamically somehow
  
  const mockCues = [
    {
      startTime: 10,
      endTime: 50,
      content: "En•gi•neer•ing: The branch of science and technology concerned with the design, building, and use of engines, machines, and structures.",
      type: 'definition' as 'definition' | 'video' | 'ad',
      referenceUrl: "https://en.wikipedia.org/wiki/Engineering",
    },
    {
      startTime: 15,
      endTime: 40,
      content: "Watch video that the host just mentioned:",
      type: 'video' as 'definition' | 'video' | 'ad',
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      imageUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      startTime: 50,
      endTime: 60,
      content: "Find the product the host is talking about here:",
      type: 'ad' as 'definition' | 'video' | 'ad',
      referenceUrl: "https://www.amazon.com/gp/product/B08J6F174Z",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/71wu%2BHMAKBL._SX342_.jpg",
    },
    // ... add more cues as necessary
  ];
  
  const [annotations, setAnnotations] = useState(mockCues);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  

  const handleNewAnnotation = () => {
    setSelectedAnnotation(null);
    onOpen();
  };

  const handleEditAnnotation = (index) => {
    setSelectedAnnotation({ ...annotations[index], index });
    onOpen();
  };

  const handleSaveAnnotation = (annotationData) => {
    if (selectedAnnotation && selectedAnnotation.index !== undefined) {
      // Update existing annotation
      const updatedAnnotations = [...annotations];
      updatedAnnotations[selectedAnnotation.index] = annotationData;
      setAnnotations(updatedAnnotations);
    } else {
      // Add new annotation
      setAnnotations([...annotations, annotationData]);
    }
    onClose();
  };

  const handleDeleteAnnotation = (index) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(updatedAnnotations);
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
          component: <PodCue cues={mockCues} />,
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



  function handleToggleList(): void {
    throw new Error("Function not implemented.");
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
      icon={<FaPlus />}
      isRound
      size="lg"
      colorScheme="teal"
      position="fixed"
      bottom="120px" // Adjust this value to position above the player bar
      right="25px"
      zIndex="overlay"
      onClick={handleNewAnnotation}
      aria-label="Add annotation"
    />

    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{selectedAnnotation ? 'Edit Annotation' : 'New Annotation'}</DrawerHeader>
        <DrawerBody>
          <AnnotationForm
              annotation={selectedAnnotation}
              saveAnnotation={handleSaveAnnotation} isOpen={undefined} onClose={undefined}          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>

    <Drawer isOpen={isOpen} placement="left" onClose={handleToggleList} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Annotations</DrawerHeader>
        <DrawerBody>
          <AnnotationList
            annotations={annotations}
            editAnnotation={handleEditAnnotation}
            deleteAnnotation={handleDeleteAnnotation}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </Box>
);
};

export default NowPlaying;
