import { Box, Flex, Button } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ForYouSection from "../components/home/ForYouSection";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { samplePodcast } from "../utilities/SampleData";

const ITEMS_PER_PAGE = 10;

const Main = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(samplePodcast.length / ITEMS_PER_PAGE);

  const currentItems = samplePodcast.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Replace these constants with actual values or compute them dynamically
  const heightOfNavbar = "60px"; // Example value
  const heightOfPlayerBar = "80px"; // Example value

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Flex 
        flex="1" 
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
      >
        {/* For You Section */}
        <Box flex="1" overflow="hidden">
          <ForYouSection podcasts={currentItems} />

          <Flex justify="center" mt={4}>
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} 
              ml={2}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </Flex>
        </Box>

        {/* Right Section */}
        <Flex flex="1" direction="column" overflow="hidden">
          {/* Continue Listening Section */}
          <Box flex="1" overflowY="auto">
            <ContinueListeningSection />
          </Box>

          {/* Explore Genres Section */}
          <Box 
            flex="1" 
            overflowY="auto" 
            maxHeight={`calc(50% - ${heightOfNavbar}/2 - ${heightOfPlayerBar}/2)`}
          >
            <ExploreGenresSection />
          </Box>
        </Flex>
      </Flex>

      {/* Player Bar */}
      <PlayerBar {...samplePodcast[0]}/>
    </Box>
  );
};

export default Main;
