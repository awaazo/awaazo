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
import PodcastHelper from "../../helpers/PodcastHelper";
import { usePalette } from "color-thief-react";
import { sliderSettings } from "../../utilities/commonUtils";
import { useRouter } from "next/router";

const NowPlaying = () => {
  const router = useRouter();
  const { EpisodeId } = router.query;
  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    if (EpisodeId) {
      PodcastHelper.getEpisodeById(EpisodeId)
        .then((response) => {
          if (response.status === 200) {
            setEpisode(response.episode);
            setIsLoading(false);
          } else {
            console.error("Error fetching episode data:", response.message);
          }
        })
        .catch((error) => console.error("Error fetching episode data:", error));
    }
  }, [EpisodeId]);


  useEffect(() => {
    if (episode) {
      setComponents([
        {
          component: <CoverArt episodeId={episode.id} />,
          inSlider: false,
        },
        // { component: <AwaazoBirdBot />, inSlider: false },
        // {
        //   component: <Bookmarks bookmarks={episode.bookmarks} />,
        //   inSlider: true,
        // },
        // {
        //   component: <Transcripts transcripts={episode.transcript} />,
        //   inSlider: true,
        // },
        // {
        //   component: <Sections sections={episode.sections} />,
        //   inSlider: true,
        // },
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
          {components.map((comp, index) => (
            <Box key={index} gridArea={comp.gridArea} p={2} onClick={() => handleComponentClick(index)}>
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
