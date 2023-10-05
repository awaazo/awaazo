import * as React from 'react';
import {
  Container,
  Center,
  VStack,
  Box,
  HStack,
} from '@chakra-ui/react';

import Navbar from "../../components/navbar"; // Import the Navbar component
import Header from "../../components/profile/header"; //Import the Header component
import MyEpisodes from "../../components/profile/myEpisodes"; //Import the MyEpisodes component


const myProfile = () => {
  return (
    <>
    <Navbar />
    <HStack>
    <VStack>

    <Container paddingTop={"10em"}>
        <Header/> 
    </Container>
    <Container p={{ base: 5, md: 10 }}>
      <MyEpisodes/>
    </Container>
    </VStack>
    <Box>
    </Box>

    </HStack>
    </>
  );
};

export default myProfile;
