import { Box } from '@chakra-ui/react';
import Navbar from '../components/shared/Navbar';
import PlayerBar from '../components/shared/PlayerBar';
import ForYouSection from '../components/home/ForYou';
import ContinueListeningSection from '../components/home/ContinueListening';
import ExploreGenresSection from '../components/home/ExploreGenres';

const Main = () => {
  return (
    <Box>
      <Navbar />
      <Box flex="1" display="flex">
        <ForYouSection />
        <Box width="50%" display="flex" flexDirection="column">
          <ContinueListeningSection />
          <ExploreGenresSection />
        </Box>
      </Box>
      <PlayerBar />
    </Box>
  );
};

export default Main;
