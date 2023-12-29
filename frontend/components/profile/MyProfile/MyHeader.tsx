import { useState, useEffect } from "react";
import {
  Avatar,
  Heading,
  Text,
  VStack,
  Stack,
  Link,
  IconButton,
  Divider,
  Flex,
  Box,
  HStack,
  useColorModeValue,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { UserProfile } from "../../../utilities/Interfaces";
import { useSession } from "next-auth/react";
// Here we have used react-icons package for the iconS
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import router from "next/router";
import UserProfileHelper from "../../../helpers/UserProfileHelper";
import Subscriptions from "./MySubscriptions";

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
  const [profile, setProfile] = useState<UserProfile>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state to track login status

  useEffect(() => {
    UserProfileHelper.profileGetRequest()
      .then((response) => {
        if (response.status == 200) {
          setProfile(response.userProfile);
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [session, isUserLoggedIn]);

  return (
    <>
      <VStack
        spacing={4}
        px={2}
        alignItems={{ base: "center", sm: "flex-start" }}
        marginBottom={"2em"}
        ml={isMobile ? "25px" : "0px"}
      >
        <HStack>
          <Avatar
            boxShadow="xl"
            style={{ width: "150px", height: "150px" }}
            src={profile?.avatarUrl}
          />
          <VStack align="start" spacing={1}>
            <Heading
              textAlign={{ base: "center", sm: "left" }}
              margin="0 auto"
              fontSize={{ base: "2rem", sm: "2.5rem" }}
            >
              {profile?.displayName}
            </Heading>
            <Text fontSize="1.5rem">
              <span style={{ color: useColorModeValue("pink", "pink") }}>
                @{profile?.username}
              </span>
            </Text>
          </VStack>
        </HStack>

        <Text textAlign="left">
          <span>Bio: {profile?.bio}</span>
        </Text>
        <HStack>
          <Subscriptions />
        </HStack>
        <Divider />
        <Flex alignItems="center" justify="center" w="100%">
          <Box textAlign="center">
            <IconButton
              as={Link}
              isExternal
              href={profile?.githubUrl}
              aria-label={"Github Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaGithub />}
              {...iconProps}
            />
            <IconButton
              as={Link}
              isExternal
              href={profile?.twitterUrl}
              aria-label={"Twitter Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaTwitter />}
              {...iconProps}
            />
            <IconButton
              as={Link}
              isExternal
              href={profile?.linkedInUrl}
              aria-label={"Linkedin Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaLinkedin />}
              {...iconProps}
            />
          </Box>

          <Button
            rounded={"full"}
            style={{
              marginLeft: "1em",
            }}
            onClick={() => {
              router.push("/profile/EditProfile");
            }}
          >
            <Text>Edit Profile</Text>
          </Button>
        </Flex>
      </VStack>
    </>
  );
}
