import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Container,
  Button,
  VStack,
  Flex,
  Tooltip,
  IconButton,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import PlaylistCard from "../../components/cards/PlaylistCard";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../types/Interfaces";
import router from "next/router";
import AuthHelper from "../../helpers/AuthHelper";
import withAuth from "../../utilities/authHOC";

const MyPlaylist = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 3;

  // Form errors
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(page, pageSize).then((res2) => {
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
      <Container
        marginBottom="1em"
        fontSize="1.5em"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        My Playlists
        <Link href="/Playlist/MyPlaylists" passHref></Link>
      </Container>
      {playlists && playlists.length == 0 ? (
        <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
          You have not created any Playlists yet
        </Text>
      ) : (
        <>
          {/* Render the list of selected episodes */}
          <VStack
            spacing={"2px"}
            w={{ base: "auto", md: "lg" }}
            minWidth="90%"
            mr={"10px"}
            ml={"10px"}
          >
            {playlists.map((playlist, index) => (
              <PlaylistCard playlist={playlist} />
            ))}
          </VStack>
          {playlists[(page + 1) * pageSize - 1] != null && (
            <Flex justify="center" mt={4} alignSelf={"center"}>
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
};

export default withAuth(MyPlaylist);
