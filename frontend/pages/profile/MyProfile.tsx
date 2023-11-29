import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Box, Stack, useBreakpointValue } from "@chakra-ui/react";

import Navbar from "../../components/shared/Navbar";
import Header from "../../components/profile/MyProfile/MyHeader";
import MyEpisodes from "../../components/profile/MyProfile/MyEpisodes";
import Podcasts from "../../components/profile/MyProfile/MyPodcasts";
import Subscriptions from "../../components/explore/MySubscriptions";

import { Router, useRouter } from "next/router";
import MyPlaylists from "../../components/profile/MyProfile/MyPlaylists";

const myProfile = () => {
  const isInline = useBreakpointValue({
    base: false,
    md: true,
    default: true,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [id, setPodcastId] = useState(1);

  const childToParent = (childdata) => {
    setPodcastId(childdata);
  };

  return (
    <>
      <Navbar />
      {isMobile ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingTop="3em"
        >
          <Container width="100%" maxWidth="100%">
            <Header />
            <Podcasts />
          </Container>
          <Container width="100%" maxWidth="100%">
            <MyEpisodes />
            <MyPlaylists />
          </Container>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" paddingTop="2em">
          <Stack isInline={isInline} spacing="4">
            <Container>
              <Header />
              <Podcasts />
            </Container>
            <Container>
              <MyEpisodes />
              <MyPlaylists />
              <Subscriptions />
            </Container>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default myProfile;
