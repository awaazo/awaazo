import { useState } from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import ChatBot from "../components/player/ChatBot";
import Bookmarks from "../components/player/Bookmarks";
import Transcripts from "../components/player/Transcripts";
import CoverArt from "../components/player/CoverArt";
import Sections from "../components/player/Sections";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { episodes } from "../utilities/SampleData";
import { usePalette } from "color-thief-react";
import { sliderSettings } from "../utilities/commonUtils";

const currentEpisode = episodes[0];
const componentsData = [
  {
    component: (
      <CoverArt
        imageUrl={currentEpisode.thumbnailUrl}
        description={currentEpisode.description}
      />
    ),
    inSlider: false,
  },
  { component: <ChatBot />, inSlider: false },
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
  const palette = usePalette(currentEpisode.thumbnailUrl, 2, "hex", {
    crossOrigin: "Anonymous",
    quality: 10,
  }).data;

  const [selectedComponent, setSelectedComponent] = useState<number | null>(
    null,
  );
  const [components] = useState(componentsData);

  const handleComponentClick = (index: number) => {
    setSelectedComponent(index === selectedComponent ? null : index);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const sliderComponents = components.filter((comp) => comp.inSlider);

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bgColor={palette || null}
    >
      <Navbar />
      {isMobile ? (
        <Slider {...sliderSettings}>
          {componentsData.map((comp, index) => (
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
        <Grid
          flexGrow={1}
          templateAreas={{
            md: `
              "slider comain"
              "main comain"
            `,
          }}
          gridTemplateRows={{ md: "1fr 1fr" }}
          gridTemplateColumns={{ md: "1fr 1fr" }}
          gap={1}
          mt={1}
          mx={0.5}
          p={4}
        >
          <Box
            gridArea="main"
            p={4}
            onClick={() => handleComponentClick(0)}
            opacity={selectedComponent === 0 ? 1 : 0.5}
            transition="opacity 0.4s ease"
          >
            {components[0].component}
          </Box>
          <Box
            gridArea="comain"
            p={4}
            onClick={() => handleComponentClick(1)}
            opacity={selectedComponent === 1 ? 1 : 0.5}
            transition="opacity 0.4s ease"
          >
            {components[1].component}
          </Box>
          <Box
            gridArea="slider"
            w="50vw"
            h="25vh"
            alignItems="stretch"
            justifyContent="center"
          >
            <Slider {...sliderSettings}>
              {sliderComponents.map((comp, index) => (
                <Box key={index}>{comp.component}</Box>
              ))}
            </Slider>
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default NowPlaying;
