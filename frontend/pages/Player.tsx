import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Navbar from '../components/shared/Navbar';
import PlayerBar from '../components/shared/PlayerBar';
import ChatBot from '../components/player/ChatBot';     
import Bookmarks from '../components/player/Bookmarks'; 
import Transcripts from '../components/player/Transcripts';

import { podcasts, episodes } from "../utilities/SampleData";

const Player: React.FC = () => {
  return (
    <Box w="100vw" h="100vh">
    <Navbar />
    <Flex direction="row" justifyContent="space-between" mt="4" mx="4">
      <ChatBot flex="1" mr="4" />
      <Box flex="2">
        <Bookmarks mb="4" />
        <Transcripts />
      </Box>
    </Flex>
      <PlayerBar {...episodes[0]}  />
      </Box>
  );
}

export default Player;
