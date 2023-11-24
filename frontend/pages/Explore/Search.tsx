import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  VStack,
  useColorMode,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";

import { PodcastByTagsRequest } from "../../utilities/Requests";
import { Podcast, User } from "../../utilities/Interfaces";
import { useRouter } from "next/router";

import Navbar from "../../components/shared/Navbar";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import PodcastCard from "../../components/explore/PodcastCard";
import ForYou from "../../components/home/ForYou";
import UserCard from "../../components/explore/UserCard";
import PlayerBar from "../../components/shared/PlayerBar";

export default function MyPodcast() {
  const router = useRouter();
  const { searchTerm } = router.query;

  // Set initial state and loading state
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(5);
  const [index3, setIndex3] = useState(0);
  const [index4, setIndex4] = useState(5);
  const [getError, setGetError] = useState("");

  useEffect(() => {
    PodcastHelper.podcastSearchPodcastsGet(index1, index2, searchTerm).then(
      (res) => {
        if (res.status == 200) {
          setPodcasts(res.podcasts);
        } else {
          setGetError("Podcasts cannot be fetched");
        }
      },
    );
  }, [index1, index2, searchTerm]);

  useEffect(() => {
    UserProfileHelper.profileSearchProfilesGet(index3, index4, searchTerm)
      .then((res) => {
        if (res.status == 200) {
          setUsers(res.users);
          console.log(res.users);
        } else {
          setGetError("Users cannot be fetched");
        }
      })
      .finally(() => {
        // Set loading to false once the data is fetched (or an error occurred)
        setLoading(false);
      });
  }, [index3, index4, searchTerm]);

  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        px={["1em", "2em", "4em"]}
        height="calc(100vh - 60px - 80px)"
      >
        {loading ? null : (
          <Box
            bgGradient="linear(to-r, #ad602d, transparent)"
            w={{ base: "70%", md: "30%" }}
            borderRadius="0.5em"
            boxShadow="lg"
            p="8px"
          >
            {!loading && (
              <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
                Searching for: "{searchTerm}"
              </Text>
            )}
          </Box>
        )}

        {loading ? (
          // Show loading indicator or spinner
          <Flex justify="center" align="center" height="100%">
            <Spinner
              size="xl"
              color="blue.200"
              thickness="1px"
              speed="0.45s"
              emptyColor="transparent"
            />
          </Flex>
        ) : (
          <Flex>
            <Box flex="1">
              {podcasts && podcasts.length > 0 && (
                <>
                  <Text fontSize="xl" fontWeight="bold" marginTop="1em" ml={4}>
                    Podcasts:
                  </Text>
                  <SimpleGrid columns={columns} spacing={7} marginTop={"1em"}>
                    {podcasts.map((podcast) => (
                      <PodcastCard podcast={podcast} key={podcast.id} />
                    ))}
                  </SimpleGrid>
                </>
              )}

              {podcasts && podcasts.length === 0 && (
                <>
                  <Text fontSize="xl" fontWeight="bold" marginTop="1em" ml={4}>
                    Podcasts:
                  </Text>
                  <Text
                    style={{ marginTop: "4em", textAlign: "center" }}
                    fontWeight="bold"
                    fontSize="xl"
                  >
                    No podcasts have been found
                  </Text>
                </>
              )}
            </Box>

            <Box flex="1" ml={30}>
              {users && users.length === 0 && (
                <>
                  <Text fontSize="xl" fontWeight="bold" marginTop="1em" ml={4}>
                    Users:
                  </Text>
                  <Text
                    style={{ marginTop: "4em", textAlign: "center" }}
                    fontWeight="bold"
                    fontSize="xl"
                  >
                    No users have been found
                  </Text>
                </>
              )}

              {users && users.length > 0 && (
                <>
                  <Text fontSize="xl" fontWeight="bold" marginTop="1em" ml={4}>
                    Users:
                  </Text>
                  <SimpleGrid columns={columns} spacing={7} marginTop={"1em"}>
                    {users.map((user) => (
                      <UserCard user={user} key={user.id} />
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Box>
          </Flex>
        )}
        <Box flex="1" borderRadius="35px" marginTop={"2em"}>
          <ForYou />
        </Box>
      </Box>
      ;
    </>
  );
}
