import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  HStack,
  Stack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Header from "../../components/profile/MyProfile/MyHeader";
import MyEpisodes from "../../components/profile/MyProfile/MyEpisodes";
import Podcasts from "../../components/profile/MyProfile/MyPodcasts";
import MyPlaylists from "../../components/profile/MyProfile/MyPlaylists";
import router, { useRouter } from "next/router";
import AuthHelper from "../../helpers/AuthHelper";


const MyProfile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [podcastId, setPodcastId] = useState(1);

  //If user is not logged in, notifications redirect to Login page
  useEffect(() => {
    const checkLogin = async () => {
      const response = await AuthHelper.authMeRequest();
      var isLoggedIn = true;
      if (response.status === 401) {
        isLoggedIn = false;
      }

      if (!isLoggedIn) {
        router.replace("/auth/Login");
      }
    };

    checkLogin();
  }, [router]);


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={"95%"}
    >
      {isMobile ? (
        <VStack justify="center" align="center" ml={"15px"}>
          <Header />
          <Podcasts />
          <MyEpisodes />
          <MyPlaylists />
        </VStack>
      ) : (
        <HStack width="80%" align={"start"} spacing={"15px"}>
          <VStack width="50%" align="start" spacing={"10px"}>
            <Header />
            <Box height="20px" />
            <Podcasts />
          </VStack>
          <VStack width="50%" align="start">
            <MyEpisodes />
            <Box height="25px" />
            <MyPlaylists />
          </VStack>
        </HStack>
      )}
    </Box>
  );
};

export default MyProfile;
