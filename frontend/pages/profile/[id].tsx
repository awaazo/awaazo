import React from "react";
import {  Box, useBreakpointValue, VStack, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import UserHeader from "../../components/profile/UserProfile/UserHeader";
import UserEpisodes from "../../components/profile/UserProfile/UserEpisodes";
import UserPodcasts from "../../components/profile/UserProfile/UserPodcasts";
import UserPlaylists from "../../components/profile/UserProfile/UserPlaylists";

export default function userProfile() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Get the podcast ID from the link
  const router = useRouter();
  const path = router.asPath;
  const userId = path.split("/").pop();


  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={"95%"}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={"15px"}>
          <UserHeader userId={userId} />
          <UserPodcasts userId={userId} />
          <UserEpisodes userId={userId} />
          <UserPlaylists userId={userId} />
        </VStack>
      ) : (
        <HStack width="80%" align={"start"} spacing={"15px"}>
          <VStack width="50%" align="start" spacing={"10px"}>
            <UserHeader userId={userId} />
            <UserPodcasts userId={userId} />
          </VStack>
          <VStack width="50%" align="start">
            <UserEpisodes userId={userId} />
            <UserPlaylists userId={userId} />
          </VStack>
        </HStack>
      )}
    </Box>
  );
}
