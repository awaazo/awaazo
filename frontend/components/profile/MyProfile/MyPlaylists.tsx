import React, { useEffect, useState } from "react";
import {
  Box,
  Tag,
  Avatar,
  HStack,
  Flex,
  Tooltip,
  Text,
  Icon,
  Link,
  IconButton,
  useColorModeValue,
  Stack,
  VStack,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";

// Here we have used react-icons package for the icon
import { FaPlay } from "react-icons/fa";
import { Playlist } from "../../../utilities/Interfaces";
import PlaylistHelper from "../../../helpers/PlaylistHelper";
import { usePlayer } from "../../../utilities/PlayerContext";
import PlaylistCard from "../../Cards/PlaylistCard";

// Define the MyEpisodes component
export default function MyPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 3;

  // Form errors
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(page, pageSize).then((res2) => {
      // If logged in, set user, otherwise redirect to login page
      console.log("HERE");
      if (res2.status == 200) {
        setPlaylists((prevPlaylists) => [...prevPlaylists, ...res2.playlists]);
      } else {
        setPlaylistError("Podcasts cannot be fetched");
      }
    });
  }, [page]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };

  return (
    <>
      {/* Render the heading */}
      <div
        style={{
          marginTop: "1em",
          fontSize: "1.5em",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        My Playlists
        <NextLink href="/MyPlaylists" passHref>
          <Button
            style={{
              fontWeight: "bold",
              marginRight: "0",
              borderRadius: "10em",
              borderColor: "rgba(158, 202, 237, 0.6)",
            }}
          >
            Manage Playlists
          </Button>
        </NextLink>
      </div>
      {playlists && playlists.length == 0 ? (
        <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
          You have not created any Playlists yet
        </Text>
      ) : (
        <>
          {/* Render the list of selected episodes */}
          <VStack spacing={6} w={{ base: "auto", md: "lg" }}>
            {playlists.map((playlist, index) => (
              <PlaylistCard playlist={playlist} />
            ))}
          </VStack>
          {playlists[(page + 1) * pageSize - 1] != null && (
            <Flex justify="center" mt={4}>
              <Tooltip label="Load More" placement="top">
                <IconButton
                  aria-label="Load More"
                  icon={<ChevronDownIcon />}
                  onClick={handleLoadMoreClick}
                  size="lg"
                  variant="outline"
                />
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
