import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ForYouSection from "../components/home/ForYouSection";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { podcasts, episodes } from "../utilities/SampleData";

const Main = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
    <Box display="flex" flexDirection="column" paddingLeft={"4em"} paddingRight={"4em"}>
        {/* Explore Genres Section */}
            <Box overflowX="hidden" className="no-scrollbar" flex="1">
              <ExploreGenresSection />
            </Box>

      {/* Main Content */}
      <Flex flex="1" overflow="hidden">
        {/* For You Section */}
        <Box flex="1" borderRadius="35px" backdropFilter="blur(35px)" boxShadow="xl">
          <Text fontSize="xl" fontWeight="bold" ml={3} mt={3}>
            For You
          </Text>
          <Box overflowY="auto" overflowX="hidden" className="no-scrollbar" height="calc(100vh - 60px - 80px)">
            <ForYouSection episodes={episodes} />
          </Box>
        </Box>

        {/* Right Section */}
        <Flex flex="1" direction="column" overflow="hidden" height="100%">
          {/* Continue Listening Section */}
          <VStack spacing={4} h="50%" borderRadius="35px" backdropFilter="blur(35px)">
            <Text fontSize="xl" fontWeight="bold" ml={3} mt={3}>
              Continue Listening
            </Text>
            <Box overflowY="auto" overflowX="hidden" className="no-scrollbar" flex="1">
              <ContinueListeningSection />
            </Box>
          </VStack>

        
        </Flex>
      </Flex>

      {/* Player Bar */}
      <PlayerBar {...episodes[0]} />
    </Box>
    </>
  );
};

export default Main;
