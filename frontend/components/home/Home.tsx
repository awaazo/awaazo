import React, { useState } from "react";
import { Box, Text, Button, ButtonGroup } from "@chakra-ui/react";
import RecentlyUploaded from "./RecentlyUploaded";
import ForYou from "./ForYou";
import HighLights from "../highlights/Highlights";

const Home = () => {
  // State to track the current view
  const [currentView, setCurrentView] = useState('ForYou');

  // Function to render the current view based on state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'RecentlyUploaded':
        return <RecentlyUploaded />;
      case 'ForYou':
        return <ForYou />;
      case 'Highlights':
        return <HighLights />;
      default:
        return <RecentlyUploaded />;
    }
  };

  return (
    <Box px={["1em", "2em", "4em"]} minH="100vh">
      <ButtonGroup mb={4} spacing={4}>
        <Button
          onClick={() => setCurrentView('ForYou')}
          variant={currentView === 'ForYou' ? 'solid' : 'ghost'}
          borderRadius={"3em"}
        >
          For You
        </Button>
        <Button
          onClick={() => setCurrentView('RecentlyUploaded')}
          variant={currentView === 'RecentlyUploaded' ? 'solid' : 'ghost'}
          borderRadius={"3em"}
        >
          Recently Uploaded
        </Button>
        <Button
          onClick={() => setCurrentView('Highlights')}
          variant={currentView === 'Highlights' ? 'solid' : 'ghost'}
          borderRadius={"3em"}
        >
          Highlights
        </Button>
      </ButtonGroup>
      {renderCurrentView()}
    </Box>
  );
};

export default Home;
