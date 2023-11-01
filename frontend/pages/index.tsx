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
      <ExploreGenresSection />
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]} > {/* Adjusted padding */}
      {/* Main Content */}

        {/* For You Section */}
        <Box flex="1" borderRadius="35px" backdropFilter="blur(35px)" boxShadow="xl">
          <Text fontSize="xl" fontWeight="bold" ml={3} mt={3}>
            For You
          </Text>
          <Box overflowY="auto" overflowX="hidden" className="no-scrollbar" height="calc(100vh - 60px - 80px)">
            <ForYouSection episodes={episodes} />
          </Box>
        </Box>

      {/* Player Bar */}
      <PlayerBar {...episodes[0]} />
    </Box>
    </>
  );
};

export default Main;
