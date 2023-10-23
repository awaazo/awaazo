import * as React from 'react';
import {
  Container,
  Box,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';

import Navbar from "../../components/shared/Navbar";
import Header from "../../components/profile/Header";
import MyEpisodes from "../../components/profile/MyEpisodes";

const myProfile = () => {
  const isInline = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="center" paddingTop="5em">
        <Stack isInline={isInline} spacing="4" alignItems="flex-start">
          <Container>
            <Header/> 
          </Container>
          <Container>
            <MyEpisodes/>
          </Container>
        </Stack>
      </Box>
    </>
  );
};

export default myProfile;
