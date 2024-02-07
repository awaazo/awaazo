import { useState, useEffect } from "react";
import {
  Avatar,
  Heading,
  Text,
  VStack,
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
import { UserProfile } from "../../../types/Interfaces";
import { useSession } from "next-auth/react";

import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import router from "next/router";
import UserProfileHelper from "../../../helpers/UserProfileHelper";
import Subscriptions from "./MySubscriptions";

const iconProps = {
  variant: "ghost",
  size: "lg",
  isRound: true,
};

export default function Header() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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
        width={"100%"}
        spacing={4}
        px={2}
        alignItems={{ base: "center", sm: "flex-start" }}
        marginBottom={"2em"}
        ml={isMobile ? "25px" : "0px"}
      >
        <HStack>
          <Box position="relative">
            <Avatar
              boxShadow="xl"
              width="7em"
              height="7em"
              src={profile?.avatarUrl}
            />
            <IconButton
              aria-label="Edit Profile"
              icon={<FiEdit2 />}
              position="absolute"
              bottom={6}
              right={6}
              transform={"translate(50%, 50%)"}
              variant="ghost"
              rounded="3xl"
              onClick={() => router.push("/profile/EditProfile")}
              backgroundColor="brand.100"
              _hover={{ bg: "brand.300" }}
              data-cy={`edit_profile_button`}
            />
          </Box>
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
              icon={<FaXTwitter />}
              {...iconProps}
            />
            <IconButton
              as={Link}
              isExternal
              href={profile?.linkedInUrl}
              aria-label={"Linkedin Account"}
              colorScheme={"gray"}
              rounded="full"
              icon={<FaLinkedinIn />}
              {...iconProps}
            />
          </Box>
        </Flex>
      </VStack>
    </>
  );
}
