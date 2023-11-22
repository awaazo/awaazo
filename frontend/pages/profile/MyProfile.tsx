import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Box, Stack, useBreakpointValue } from "@chakra-ui/react";

import Navbar from "../../components/shared/Navbar";
import Header from "../../components/profile/Header";
import MyEpisodes from "../../components/profile/MyEpisodes";
import Podcasts from "../../components/profile/Podcasts";
import { UserProfile } from "../../utilities/Interfaces";

import { Router, useRouter } from "next/router";
import UserProfileHelper from "../../helpers/UserProfileHelper";


const myProfile = () => {

  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  const isInline = useBreakpointValue({
    base: false,
    md: true,
    default: false,
  });

  const [id, setPodcastId] = useState(1);

  const childToParent = (childdata) => {
    setPodcastId(childdata);
  };

  //Router
  const router = useRouter();

  useEffect(() => {

  // Get the user profile
  UserProfileHelper.profileGetRequest().then((response) => {
    if (response.status == 200) {
      setUserProfile(response.userProfile)
    }
    else {
      router.push("/auth/Login");
    }
  })
}, [router]);

//If the user is logged in
if(userProfile!==undefined) {
  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="center" paddingTop="5em">
        <Stack isInline={isInline} spacing="4" alignItems="flex-start">
          <Container>
            <Header />
            {/* Fetch the podcast ID from Podcasts */}
            <Podcasts childToParent={childToParent} />
          </Container>
          <Container>
            {/* Pass the podcast ID to MyEpisodes */}
            <MyEpisodes selectedPodcastId={id} />
          </Container>
        </Stack>
      </Box>
    </>
    )
  }
};

export default myProfile;
