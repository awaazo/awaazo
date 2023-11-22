import { useState } from 'react';
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

//For later to subscribe to podcasts {session?.user?.subscribedPodcastsID}
//const { data: session } = useSession();

const myProfile = () => {
const isInline = useBreakpointValue({ base: false, md: true, default: false });

  const [id, setPodcastId] = useState(1);

  const childToParent = (childdata) => {
    setPodcastId(childdata)
  }

  return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" paddingTop="5em">
          <Stack isInline={isInline} spacing="4" alignItems="flex-start">
            <Container>
              <Header/> 
              {/* Fetch the podcast ID from Podcasts */}
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
