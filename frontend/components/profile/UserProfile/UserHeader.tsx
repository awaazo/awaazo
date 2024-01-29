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
import { useSession } from "next-auth/react";
// Here we have used react-icons package for the iconS
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import router from "next/router";
import UserProfileHelper from "../../../helpers/UserProfileHelper";
import { userProfileByID } from "../../../utilities/Interfaces";

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

export default function Header({ userId }) {
  // Form Values
  const [user, setUser] = useState<userProfileByID | null>(null);
  const [getError, setGetError] = useState("");

  const { data: session } = useSession();
  const [profile, setProfile] = useState<userProfileByID>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state to track login status

  useEffect(() => {
    console.log(userId);

    // Ensure userId is truthy before making the API call
    UserProfileHelper.profileGetByIdRequest(userId).then((res) => {
      // If logged in, set user, otherwise redirect to the login page
      if (res.status === 200) {
        setUser(res.userProfileByID);
      } else {
        setGetError("Podcasts cannot be fetched");
      }
    });
  }, [userId]);

  return (
    <>
      <VStack
        width={"100%"}
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
            src={user?.avatarUrl}
          />
          <VStack align="start" spacing={1}>
            <Heading
              textAlign={{ base: "center", sm: "left" }}
              margin="0 auto"
              fontSize={{ base: "2rem", sm: "2.5rem" }}
            >
              {user?.displayName}
            </Heading>
            <Text fontSize="1.5rem">
              <span style={{ color: useColorModeValue("pink", "pink") }}>
                @{user?.username}
              </span>
            </Text>
          </VStack>
        </HStack>

        <Text textAlign="left">
          <span>Bio: {user?.bio}</span>
        </Text>
        <HStack>
          <Button
            rounded="7px"
            style={{
              // styling for number of followers, and when clicked, goes to the followers page
              border: "solid 1px #CC748C",
            }}
          >
            420 Subscriptions
          </Button>
          <Button
            rounded="7px"
            style={{
              // styling for the number of followers, and when clicked, goes to the followers page
              border: "solid 1px #CC748C",
            }}
          >
            Subscribed to 69 Podcasts
          </Button>
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
              href={user?.twitterUrl}
              aria-label={"Twitter Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaTwitter />}
              {...iconProps}
            />
            <IconButton
              as={Link}
              isExternal
              href={user?.linkedInUrl}
              aria-label={"Linkedin Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaLinkedin />}
              {...iconProps}
            />
          </Box>
        </Flex>
      </VStack>
    </>
  );
}
