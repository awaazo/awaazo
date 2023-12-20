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
import PodcastCard from "../../components/cards/PodcastCard";
import ForYou from "../../components/home/ForYou";
import UserCard from "../../components/cards/UserCard";
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
    UserProfileHelper.profileSearchProfilesGet(index3, index4, searchTerm)
      .then((res) => {
        if (res.status == 200) {
          setUsers(res.users);
        } else {
          setGetError("Users cannot be fetched");
        }
      })
      .finally(() => {
        // Set loading to false once the data is fetched (or an error occurred)
        setLoading(false);
      });
  }, [index1, index2, index3, index4, searchTerm]);

  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  return (
    <>
      <Navbar />
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gridTemplateRows="auto"
        px={["1em", "2em", "4em"]}
        height="calc(100vh - 60px - 80px)"
      >
        {loading ? null : (
          <Box
            bgGradient="linear(to-r, #ad602d, transparent)"
            gridColumn="span 2"
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
          <Flex justify="center" align="center" gridColumn="span 2">
            <Spinner
              size="xl"
              color="blue.200"
              thickness="1px"
              speed="0.45s"
              emptyColor="transparent"
            />
          </Flex>
        ) : (
          <>
            <Box gridColumn="1">
              <Text fontSize="xl" fontWeight="bold" marginTop="1em" ml={8}>
                Podcasts:
              </Text>
              {podcasts && podcasts.length > 0 ? (
                <SimpleGrid
                  columns={columns}
                  spacing={7}
                  marginTop={"1em"}
                  gridColumn="1"
                >
                  {podcasts.map((podcast) => (
                    <PodcastCard podcast={podcast} key={podcast.id} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text
                  style={{ marginTop: "50px" }}
                  fontWeight="bold"
                  fontSize=""
                  gridColumn="1"
                  textAlign="center"
                >
                  (No podcasts have been found)
                </Text>
              )}
            </Box>
            <Box gridColumn="2">
              <Text fontSize="xl" ml={8} fontWeight="bold" marginTop="1em">
                Users:
              </Text>
              {users && users.length > 0 ? (
                <SimpleGrid
                  columns={columns}
                  spacing={7}
                  marginTop={"1em"}
                  gridColumn="2"
                >
                  {users.map((user) => (
                    <UserCard user={user} key={user.id} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text
                  style={{ marginTop: "50px" }}
                  fontWeight="bold"
                  fontSize="xl"
                  gridColumn="2"
                  textAlign="center"
                >
                  (No users have been found)
                </Text>
              )}
            </Box>
          </>
        )}

        <Box flex="1" borderRadius="35px" marginTop={"2em"} gridColumn="span 2">
          <ForYou />
        </Box>
      </Box>
    </>
  );
}
