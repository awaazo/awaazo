import React, { useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ChatBot from "../components/player/ChatBot";
import Bookmarks from "../components/player/Bookmarks";
import Transcripts from "../components/player/Transcripts";
import CoverArt from "../components/player/CoverArt";
import Sections from "../components/player/Sections";
import { episodes } from "../utilities/SampleData";
import { usePalette } from "color-thief-react";

const currentEpisode = episodes[0];

const componentsData = [
  {
    component: <CoverArt imageUrl={currentEpisode.coverArt} description={currentEpisode.description} />,
    isVisible: true,
    mainComponent: true,
  },
  { component: <ChatBot />, isVisible: true },
  {
    component: <Bookmarks bookmarks={currentEpisode.bookmarks} />,
    isVisible: true,
  },
  {
    component: <Transcripts transcripts={currentEpisode.transcript} />,
    isVisible: true,
    coMainComponent: true,
  },
  {
    component: <Sections sections={currentEpisode.sections} />,
    isVisible: true,
  },
];

const Player = () => {
  const {
    data: palette,
    loading,
    error,
  } = usePalette(
    currentEpisode.coverArt, // src
    2, 
    "hex",
    {
      crossOrigin: "Anonymous",
      quality: 10,
    }
  );

  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [currentAdditionalComponent, setCurrentAdditionalComponent] = useState<number | null>(null);
  const [components, setComponents] = useState<
    {
      component: React.ReactNode;
      isVisible: boolean;
      mainComponent?: boolean;
      coMainComponent?: boolean;
    }[]
  >(componentsData);

  const handleComponentClick = (index: number) => {
    if (index === selectedComponent) return;

    const updatedComponents = updateComponentSelection(index);
    setComponents(updatedComponents);
    setSelectedComponent(index);

    if (!components[index].mainComponent && !components[index].coMainComponent) {
      setCurrentAdditionalComponent(index);
    }
  };

  const updateComponentSelection = (selectedIndex: number) =>
    components.map((comp, index) => {
      let updatedComponent = { ...comp };

      if (index === selectedIndex) {
        updatedComponent.mainComponent = true;
        updatedComponent.coMainComponent = false;
      } else if (comp.mainComponent && React.isValidElement(comp.component)) {
        updatedComponent.mainComponent = false;
        updatedComponent.coMainComponent = comp.component.type === CoverArt;
      }

      return updatedComponent;
    });

  const visibleComponents = components.filter((comp) => comp.isVisible);
  return (
    <Box w="100vw" h="100vh" display="flex" flexDirection="column" overflow="hidden" bgColor={palette || "black"}>
      <Navbar />

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
            gridColumn={comp.mainComponent ? { base: "span 3", md: "span 2" } : "span 1"}
            gridRow={comp.coMainComponent ? "1" : "auto"}
            w="full"
            h="full"
            mb={{ base: "4", md: "0" }}
            p="2"
            transition="all 0.4s ease"
            onClick={() => handleComponentClick(index)}
            transform={selectedComponent === index ? "scale(1.01)" : "scale(1)"}
            transformOrigin="center center" // Added transform origin
            opacity={comp.mainComponent || comp.coMainComponent ? 1 : 0.5}
          >
            {comp.component}
          </Box>
        ))}
      </Grid>
      <PlayerBar {...currentEpisode} />
    </Box>
  );
};

export default Player;
