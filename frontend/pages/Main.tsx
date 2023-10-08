import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar";
import PlayerBar from "../components/shared/PlayerBar";
import ForYouSection from "../components/home/ForYouSection";
import ContinueListeningSection from "../components/home/ContinueListening";
import ExploreGenresSection from "../components/home/ExploreGenres";
import { Podcast } from "../utilities/Types";

const Main = () => {
  {/* delete when the api is working  */}
  const samplePodcasts: Podcast[] = [
    {
      coverArt: "https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      episodeName: "Episode One",
      podcaster: "Joe Rogan",
      duration: 6322,
      likes: {
        count: 120,
        isLiked: true,
      },
      comments: {
        count: 45,
        isCommented: false,
      },
      isPlaying: true,
      isBookmarked: false,
      sections: [
        { startTime: 0, episodeName: "Introduction" },
        { startTime: 30, episodeName: "Chapter 1" },
        { startTime: 70, episodeName: "Chapter 2" },
      ],
    },
    {
      coverArt: "https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      episodeName: "Episode Two",
      podcaster: "Jane Smith",
      duration: 7510,
      likes: {
        count: 200,
        isLiked: false,
      },
      comments: {
        count: 80,
        isCommented: true,
      },
      isPlaying: false,
      isBookmarked: true,
      sections: [],
    },
  ];
 {/* delete up until here  */}
 
  return (
    <Box>
      <Navbar />

      <Flex flex="1" flexDirection={{ base: "column", md: "row" }}>
        {/* 50% left - For You Section */}
        <Box flex={{ base: "1", md: "0.5" }}>
          <ForYouSection podcasts={samplePodcasts} />
        </Box>

        {/* 50% right split into two 25% sections */}
        <Flex flex={{ base: "1", md: "0.5" }} flexDirection="column">
          <Box flex="0.5">
            <ContinueListeningSection />
          </Box>

          <Box flex="0.5">
            <ExploreGenresSection />
          </Box>
        </Flex>
      </Flex>
      <PlayerBar {...samplePodcasts[0]} />
    </Box>
  );
};

export default Main;
