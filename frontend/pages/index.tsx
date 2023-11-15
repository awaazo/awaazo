import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import RecentlyUploaded from "../components/home/RecentlyUploaded";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { podcasts, episodes } from "../utilities/SampleData";
import ForYou from "../components/home/ForYou";

const Main = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        px={["1em", "2em", "4em"]}
        height="calc(100vh - 60px - 80px)"
      >
        <ExploreGenresSection />
        <Box flex="1" borderRadius="35px">
          <Box overflowY="hidden" overflowX="hidden" className="no-scrollbar">
            <RecentlyUploaded />
          </Box>
          <ForYou />
        </Box>
      </Box>
    </>
  );
};

export default Main;
