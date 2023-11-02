import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import RecentlyUploaded from "../components/home/RecentlyUploaded";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { podcasts, episodes } from "../utilities/SampleData";

const Main = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
      <ExploreGenresSection />
        <Box flex="1" borderRadius="35px" backdropFilter="blur(35px)">
          <Box
            overflowY="auto"
            overflowX="hidden"
            className="no-scrollbar"
            height="calc(100vh - 60px - 80px)"
          >
            <RecentlyUploaded episodes={episodes} />
          </Box>
        </Box>



        {/* Player Bar */}
        <PlayerBar {...episodes[0]} />
      </Box>
    </>
  );
};

export default Main;
