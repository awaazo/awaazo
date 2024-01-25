import { Box, Text } from "@chakra-ui/react";
import RecentlyUploaded from "./RecentlyUploaded";
import ExploreGenresSection from "./ExploreGenres";
import ForYou from "./ForYou";

const Home = () => {
  return (
    <Box px={["1em", "2em", "4em"]} minH="100vh">
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Explore Genres
        </Text>
        <ExploreGenresSection />
      </Box>
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Recently Uploaded
        </Text>
        <RecentlyUploaded />
      </Box>
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Podcasts For You
        </Text>
        <ForYou />
      </Box>
    </Box>
  );
};

export default Home;
