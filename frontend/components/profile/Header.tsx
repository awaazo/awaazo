import React, { useCallback, useState, useEffect } from 'react';
import { Avatar, Heading, Text, VStack, Stack, Link, IconButton, Divider, Flex, Box, HStack, useColorModeValue, Button } from "@chakra-ui/react";
import { UserMenuInfo, UserProfile } from "../../utilities/Interfaces";
import AuthHelper from "../../helpers/AuthHelper";
import { useSession } from "next-auth/react";
// Here we have used react-icons package for the iconS
import { FaGithub, FaLinkedin, FaQuora, FaTwitter } from "react-icons/fa";
import router from "next/router";
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
  {
    url: "https://www.quora.com/",
    label: "Quora Account",
    type: "red",
    icon: <FaQuora />,
  },
];

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile>({
    id:null,
  avatarUrl:null,
  email:null,
  username:null,
  bio:null,
  interests: null,
  twitterUrl:null,
  gitHubUrl:null,
  linkedInUrl:null,
  websiteUrl:null,
  dateOfBirth:null,
  gender:null,
});

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state to track login status
    
    useEffect(() => {

      AuthHelper.isLoggedIn().then((response) => {
        setIsUserLoggedIn(response);
        console.log(response)
      })
  
      if(user.id==null && isUserLoggedIn){
        UserProfileHelper.profileGetRequest().then((response) => {
          setUser(response.userProfile);
        })
      }
      console.log(isUserLoggedIn)
  
    }, [session, isUserLoggedIn]);

  return (
    <>
      <VStack spacing={4} px={2} alignItems={{ base: "center", sm: "flex-start" }} marginBottom={"2em"}>
        <Stack>
          <Avatar boxShadow="xl" size="xl" src={user.avatarUrl} />
        </Stack>
        <Heading textAlign={{ base: "center", sm: "left" }} margin="0 auto" width={{ base: "23rem", sm: "auto" }} fontSize={{ base: "2.5rem", sm: "3rem" }}>
          The Really Good Podcast
          <br />
          <Text fontSize="1.5rem">
            <span style={{ color: useColorModeValue("pink", "pink") }}>@{user.username}</span>
          </Text>
        </Heading>

        <Text textAlign="center">{user.bio}</Text>
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
            {socials.map((sc, index) => (
              <IconButton key={index} as={Link} isExternal href={sc.url} aria-label={sc.label} colorScheme={sc.type} rounded="full" icon={sc.icon} {...iconProps} />
            ))}
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
