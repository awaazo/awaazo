import { Box } from "@chakra-ui/react";
import RecentlyUploaded from "./RecentlyUploaded";
import ExploreGenresSection from "./ExploreGenres";
import ForYou from "./ForYou";

const Home = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]} height="calc(100vh - 60px - 80px)">
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

export default Home;
