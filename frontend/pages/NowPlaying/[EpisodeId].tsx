import { useState, useEffect } from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import Navbar from "../../components/shared/Navbar";
import AwaazoBirdBot from "../../components/nowPlaying/AwaazoBirdBot";
import Bookmarks from "../../components/nowPlaying/Bookmarks";
import Transcripts from "../../components/nowPlaying/Transcripts";
import CoverArt from "../../components/nowPlaying/CoverArt";
import Sections from "../../components/nowPlaying/Sections";
import PodCue from "../../components/nowPlaying/PodCue";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EndpointHelper from "../../helpers/EndpointHelper";
import { episodes } from "../../utilities/SampleData";
import { usePalette } from "color-thief-react";
import { sliderSettings } from "../../utilities/commonUtils";
import { useRouter } from "next/router";

const currentEpisode = episodes[0];
const componentsData = [
  {
    component: <CoverArt imageUrl={currentEpisode.thumbnailUrl} description={currentEpisode.description} />,
    inSlider: false,
  },
  { component: <AwaazoBirdBot />, inSlider: false },
  {
    component: <Bookmarks bookmarks={currentEpisode.bookmarks} />,
    inSlider: true,
  },
  {
    component: <Transcripts transcripts={currentEpisode.transcript} />,
    inSlider: true,
  },
  {
    component: <Sections sections={currentEpisode.sections} />,
    inSlider: true,
  },
];

const NowPlaying = () => {
  const router = useRouter();
  const { EpisodeId } = router.query;

  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (EpisodeId) {
      fetch(EndpointHelper.getPodcastEpisodeByIdEndpoint(EpisodeId))
        .then((response) => response.json())
        .then((data) => {
          setEpisode(data);
          setIsLoading(false);
        })
        .catch((error) => console.error("Error fetching episode data:", error));
    }
  }, [EpisodeId]);

  const palette = usePalette(currentEpisode.thumbnailUrl, 2, "hex", {
    crossOrigin: "Anonymous",
    quality: 10,
  }).data;

  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [components] = useState(componentsData);

  const handleComponentClick = (index: number) => {
    setSelectedComponent(index === selectedComponent ? null : index);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const sliderComponents = components.filter((comp) => comp.inSlider);

  return (
     <Box w="100vw" h="100vh" display="flex" flexDirection="column" overflow="hidden">
    {/* //bgColor={palette || null} */}
      <Navbar />
      {isMobile ? (
        <Slider {...sliderSettings}>
          {components.map((comp, index) => (
            <Box key={index} w="full" h="80vh" p={4} alignItems="stretch" justifyContent="center">
              {comp.component}
            </Box>
          ))}
        </Slider>
      ) : (
        <Box 
        flexGrow={1} 
        pl={3} 
        pr={3} 
        mx={5} 
        overflow="hidden"
      >
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
          <Box gridArea="AwaazoBirdBot" p={2} onClick={() => handleComponentClick(1)}>
            {components[1].component}
          </Box>
          <Box gridArea="transcripts" p={2} onClick={() => handleComponentClick(3)}>
            {components[3].component}
          </Box>
          <Box gridArea="bookmarks" p={2} onClick={() => handleComponentClick(2)}>
            {components[2].component}
          </Box>
          <Box gridArea="sections" p={2} onClick={() => handleComponentClick(4)}>
            {components[4].component}
          </Box>
          <Box gridArea="coverart" p={2} onClick={() => handleComponentClick(0)}>
            {components[0].component}
          </Box>
        </Grid>
        </Box>
      )}
    </Box>
  );
};

export default NowPlaying;
