import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useColorMode,
  Box,
  Container,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { UserProfile } from "../../utilities/Interfaces";
import { useRouter } from "next/router";
import UserHeader from "../../components/profile/UserProfile/UserHeader";
import UserEpisodes from "../../components/profile/UserProfile/UserEpisodes";
import UserPodcasts from "../../components/profile/UserProfile/UserPodcasts";
import UserPlaylists from "../../components/profile/UserProfile/UserPlaylists";

export default function userProfile() {
  const isInline = useBreakpointValue({
    base: false,
    md: true,
    default: true,
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Get the podcast ID from the link
  const router = useRouter();
  const path = router.asPath;
  const userId = path.split("/").pop();

  // Page refs
  const { colorMode } = useColorMode();

  // Form Values
  const [user, setUser] = useState<UserProfile | null>(null);
  const [getError, setGetError] = useState("");
  // State variable for selected episode

  const [selectedEpisode, setSelectedEpisode] = useState(null);

  return (
    <>
      {isMobile ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingTop="3em"
        >
          <Container width="100%" maxWidth="100%">
            <UserHeader userId={userId} />
            <UserPodcasts userId={userId} />
          </Container>
          <Container width="100%" maxWidth="100%">
            <UserEpisodes userId={userId} />
            <UserPlaylists userId={userId} />
          </Container>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" paddingTop="2em">
          <Stack isInline={isInline} spacing="4">
            <Container>
              <UserHeader userId={userId} />
              <UserPodcasts userId={userId} />
            </Container>
            <Container>
              <UserEpisodes userId={userId} />
              <UserPlaylists userId={userId} />
            </Container>
          </Stack>
        </Box>
      )}
    </>
  );
}
