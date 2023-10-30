import * as React from 'react';
import {
  Container,
  Center,
  VStack,
  Box,
  HStack,
} from '@chakra-ui/react';

import Navbar from "../../components/shared/Navbar"; // Import the Navbar component


const myPodcasts = () => {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Box p={4}>My Podcasts Page</Box>
        </Box>
      </Center>
    </>
  );
};

export default myPodcasts;