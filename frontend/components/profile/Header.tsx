import React, { useCallback, useState, useEffect } from 'react';
import { Avatar, Heading, Text, VStack, Stack, Link, IconButton, Divider, Flex, Box, HStack, useColorModeValue, Button } from "@chakra-ui/react";
import { UserMenuInfo } from "../../utilities/Interfaces";
import { UserProfile } from '../../utilities/Interfaces';
import AuthHelper from "../../helpers/AuthHelper";
import { useSession } from "next-auth/react";
// Here we have used react-icons package for the iconS
import { FaGithub, FaLinkedin, FaQuora, FaTwitter } from "react-icons/fa";
import router from "next/router";
import { set } from 'lodash';
import EndpointHelper from '../../helpers/EndpointHelper';
import UserProfileHelper from '../../helpers/UserProfileHelper';


const iconProps = {
  variant: "ghost",
  size: "lg",
  isRound: true,
};

const socials = [
  {
    url: "https://github.com/",
    label: "Github Account",
    type: "gray",
    icon: <FaGithub />,
  },
  {
    url: "https://twitter.com/",
    label: "Twitter Account",
    type: "twitter",
    icon: <FaTwitter />,
  },

  {
    url: "https://linkedin.com/",
    label: "LinkedIn Account",
    type: "linkedin",
    icon: <FaLinkedin />,
  },
];

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserMenuInfo>(null);
  const [profile, setProfile] = useState<UserProfile>(null);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state to track login status

  useEffect(() => {
    AuthHelper.isLoggedIn()
      .then((response) => {
        setIsUserLoggedIn(response);
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });

    if (isUserLoggedIn) {
      AuthHelper.authMeRequest()
        .then((response) => {
          if (response.userMenuInfo) {
            setUser(response.userMenuInfo);
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
      // Add get profile request here
      UserProfileHelper.profileGetRequest().then((response) => {
        if (response && response.userProfile) {
          setProfile(response.userProfile);
        }
      })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [session, isUserLoggedIn]);

  return (
    <>
      <VStack spacing={4} px={2} alignItems={{ base: "center", sm: "flex-start" }} marginBottom={"2em"}>
        <Stack>
          <Avatar boxShadow="xl" size="xl" src={profile?.avatarUrl} />
        </Stack>
        <Heading textAlign={{ base: "center", sm: "left" }} margin="0 auto" width={{ base: "23rem", sm: "auto" }} fontSize={{ base: "2.5rem", sm: "3rem" }}>
          The Really Good Podcast
          <br />
          <Text fontSize="1.5rem">
            <span style={{ color: useColorModeValue("pink", "pink") }}>@{user?.username}</span>
          </Text>
        </Heading>

        <Text textAlign="center" >
          <span>
            Bio: {profile?.bio}
          </span>
        </Text>
        <HStack>
          <Button
            rounded="7px"
            style={{
              // styling for number of followers, and when clicked, goes to the followers page
              border: "solid 1px #CC748C",
            }}
          >
            420 Followers
          </Button>
          <Button
            rounded="7px"
            style={{
              // styling for number of followers, and when clicked, goes to the followers page
              border: "solid 1px #CC748C",
            }}
          >
            Following 69 Hosts
          </Button>
        </HStack>
        <Divider />
        <Flex alignItems="center" justify="center" w="100%">
          <Box textAlign="center">
              <IconButton as={Link} isExternal href={profile?.gitHubUrl} aria-label={"Github Account"} colorScheme={"gray"} rounded="full" icon={<FaGithub />} {...iconProps} />
              <IconButton as={Link} isExternal href={profile?.twitterUrl} aria-label={"Twitter Account"} colorScheme={"gray"} rounded="full" icon={<FaTwitter />} {...iconProps} />
              <IconButton as={Link} isExternal href={profile?.linkedInUrl} aria-label={"Linkedin Account"} colorScheme={"gray"} rounded="full" icon={<FaLinkedin />} {...iconProps} />
          </Box>
          <Button rounded={"full"}>
            {/* <Icon as={Follow} w={6} h={6} /> */}
            <Text>Follow</Text>
            {/*// this will be hidden if the current user is the one viewing his own profile*/}
          </Button>
          <Button
            rounded={"full"}
            style={{
              marginLeft: "1em",
            }}
            onClick={() => {
              router.push('/profile/EditProfile');
            }}
          >
            {/* <Icon as={Follow} w={6} h={6} /> */}
            <Text>Edit Profile</Text>
            {/* this will also be hidden for viewing other users' profiles*/}
          </Button>
        </Flex>
      </VStack>
    </>
  );
}
