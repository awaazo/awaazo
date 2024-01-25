import * as React from "react";
import { useState } from "react";
import { Box, Container, Stack, useBreakpointValue } from "@chakra-ui/react";
import Header from "../../components/profile/MyProfile/MyHeader";
import MyEpisodes from "../../components/profile/MyProfile/MyEpisodes";
import Podcasts from "../../components/profile/MyProfile/MyPodcasts";
import MyPlaylists from "../../components/profile/MyProfile/MyPlaylists";

const MyProfile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [podcastId, setPodcastId] = useState(1);

  const ContentContainer = ({ children }) => (
    <Container width="100%" maxWidth="100%" paddingTop={isMobile ? "3em" : "2em"}>
      {children}
    </Container>
  );

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {isMobile ? (
        <ContentContainer>
          <Header />
          <Podcasts />
          <MyEpisodes />
          <MyPlaylists />
        </ContentContainer>
      ) : (
        <Stack direction="row" spacing="4">
          <ContentContainer>
            <Header />
            <Podcasts />
          </ContentContainer>
          <ContentContainer>
            <MyEpisodes />
            <MyPlaylists />
          </ContentContainer>
        </Stack>
      )}
    </Box>
  );
};

export default MyProfile;
