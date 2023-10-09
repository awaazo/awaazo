import { Box, Flex, Button } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ForYouSection from "../components/home/ForYouSection";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { podcasts, episodes } from "../utilities/SampleData";

const Main = () => {

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Flex flex="1" direction={{ base: "column", md: "row" }} overflow="hidden">
        {/* For You Section */}
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <ForYouSection episodes={episodes} />
        </Box>

        {/* Right Section */}
        <Flex flex="1" direction="column" overflow="hidden">
          {/* Continue Listening Section */}
          <Box flex="1" overflowY="auto"overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
            <ContinueListeningSection />
          </Box>

          {/* Explore Genres Section */}
          <Box flex="1" overflowY="auto" overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
            <ExploreGenresSection />
          </Box>
        </Flex>
      </Flex>

      {/* Player Bar */}
      <PlayerBar {...episodes[0]} />
    </Box>
  );
};

export default Main;
