import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Container,
  Box,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';

import Navbar from "../../components/shared/Navbar";
import Header from "../../components/profile/Header";
import MyEpisodes from "../../components/profile/MyEpisodes";
import Podcasts from "../../components/profile/Podcasts";

const myProfile = () => {
const isInline = useBreakpointValue({ base: false, md: true, default: false });

  const [id, setPodcastId] = useState(1);

  // useEffect(() => console.log(id), [id]);

  const childToParent = (childdata) => {
    setPodcastId(childdata)
    
  }

  const parentToChild = () => {setPodcastId(id);console.log(id);}

  return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" paddingTop="5em">
          <Stack isInline={isInline} spacing="4" alignItems="flex-start">
            <Container>
              <Header/> 
              <Podcasts childToParent={childToParent}/>
            </Container>
            <Container>
              {/* Pass the podcast ID to MyEpisodes */}
              <MyEpisodes selectedPodcastId={id}/>
            </Container>
          </Stack>
        </Box>
      </>
    );
  };

export default myProfile;
