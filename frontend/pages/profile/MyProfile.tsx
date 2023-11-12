import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Box, Stack, useBreakpointValue } from "@chakra-ui/react";

import Navbar from "../../components/shared/Navbar";
import Header from "../../components/profile/Header";
import MyEpisodes from "../../components/profile/MyEpisodes";
import Podcasts from "../../components/profile/Podcasts";
import { UserProfile } from "../../utilities/Interfaces";
//import { useSession } from "next-auth/react";
//const { data: session } = useSession();
//For later to subscribe to podcasts {session?.user?.subscribedPodcastsID}

import { Router, useRouter } from "next/router";
import UserProfileHelper from "../../helpers/UserProfileHelper";


const myProfile = () => {

  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [genreColors, setGenreColors] = useState({});
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);


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
      setUsername(response.userProfile.username)
      setDisplayName(response.userProfile.displayName)
      setBio(response.userProfile.bio)
      setTwitterLink(response.userProfile.twitterUrl)
      setLinkedinLink(response.userProfile.linkedInUrl)
      setGithubLink(response.userProfile.githubUrl)
      setWebsiteUrl(response.userProfile.websiteUrl)
      setAvatar(response.userProfile.avatarUrl)
    }
    else {
      router.push("/auth/login");
    }
  })
}, [router]);

//If the user is logged in
//(remove next line when authentication works)
if(userProfile==undefined) {
//if(userProfile!==undefined) {
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
