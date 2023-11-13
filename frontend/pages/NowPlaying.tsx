import React, { useState } from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ChatBot from "../components/nowPlaying/ChatBot";
import Bookmarks from "../components/nowPlaying/Bookmarks";
import Transcripts from "../components/nowPlaying/Transcripts";
import CoverArt from "../components/nowPlaying/CoverArt";
import Sections from "../components/nowPlaying/Sections";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { episodes } from "../utilities/SampleData";
import { usePalette } from "color-thief-react";

const currentEpisode = episodes[0];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const componentsData = [
  {
    component: (
      <CoverArt
        imageUrl={currentEpisode.coverArt}
        description={currentEpisode.description}
      />
    ),
    isVisible: true,
    mainComponent: true,
  },
  { component: <ChatBot />, isVisible: true, coMainComponent: true },
  {
    component: <Bookmarks bookmarks={currentEpisode.bookmarks} />,
    isVisible: true,
  },
  {
    component: <Transcripts transcripts={currentEpisode.transcript} />,
    isVisible: true,
  },
  {
    component: <Sections sections={currentEpisode.sections} />,
    isVisible: true,
  },
];

const NowPlaying = () => {
  const palette = usePalette(currentEpisode.coverArt, 2, "hex", {
    crossOrigin: "Anonymous",
    quality: 10,
  }).data;

  const [selectedComponent, setSelectedComponent] = useState<number | null>(
    null,
  );
  const [components, setComponents] = useState(() =>
    componentsData.map((component, index) => ({
      ...component,
      mainComponent: index === 0,
      coMainComponent: index === 0 && component.coMainComponent,
    })),
  );

  const handleComponentClick = (index: number) => {
    if (index === selectedComponent) {
      setSelectedComponent(null);
    } else {
      setSelectedComponent(index);
      setComponents((currentComponents) =>
        currentComponents.map((comp, compIndex) => ({
          ...comp,
          mainComponent: index === compIndex,
          coMainComponent: comp.coMainComponent && index === compIndex,
        })),
      );
    }
  };

  const visibleComponents = components.filter((comp) => comp.isVisible);
  const isMobile = useBreakpointValue({ base: true, md: false });

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
          templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
          gap={4}
          mt="4"
          mx="4"
          padding="1.5rem"
        >
          {visibleComponents.map((comp, index) => (
            <Box
              key={index}
              gridColumn={
                comp.mainComponent ? { base: "span 3", md: "span 2" } : "span 1"
              }
              gridRow={comp.coMainComponent ? "1" : "auto"}
              w="full"
              h="full"
              mb={{ base: "4", md: "0" }}
              p={1}
              transition="all 0.4s ease"
              onClick={() => handleComponentClick(index)}
              transform={
                selectedComponent === index ? "scale(1.01)" : "scale(1)"
              }
              transformOrigin="center center"
              opacity={comp.mainComponent || comp.coMainComponent ? 1 : 0.5}
            >
              {comp.component}
            </Box>
          ))}
        </Grid>
      )}
      <PlayerBar {...currentEpisode} />
    </Box>
  );
};

export default NowPlaying;
