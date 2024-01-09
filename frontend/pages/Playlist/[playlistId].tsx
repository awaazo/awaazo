import React, { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import type { Episode } from "../../utilities/Interfaces";
import type { Playlist } from "../../utilities/Interfaces";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import EpisodeCard from "../../components/cards/EpisodeCard";
import { RiPlayList2Fill } from "react-icons/ri";
import { formatSecToDurationString } from "../../utilities/commonUtils";
import { ImShuffle } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";
import { useRouter } from "next/router";
import PlaylistMenu from "../../components/playlist/PlaylistMenu";

export default function Playlist() {
  const router = useRouter();
  const { playlistId } = router.query;
  const { dispatch } = usePlayer();
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(null);
  const [reload, setReload] = useState(false);
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PlaylistHelper.playlistsEpisodesGet(playlistId);
        setPlaylist(response.playlist);
        setEpisodes(response.playlist.playlistEpisodes);
      } catch (error) {
        setPlaylistError("Cannot load Playlist");
      }
    };
    fetchData();
  }, [playlistId, reload]);

  const handlePlaylistClick = () => {
    dispatch({
      type: "PLAY_PLAYLIST_NOW",
      payload: playlist,
    });
  };

  const handlePlaylistShuffleClick = () => {
    dispatch({
      type: "SHUFFLE_PLAYLIST_NOW",
      payload: playlist,
    });
  };

  const updatePlaylistData = (updatedPlaylist) => {
    setPlaylist(updatedPlaylist);
  };

  return (

      <VStack spacing="4" align="stretch" width="95%" justify="center" mx="auto">
        {playlist && (
          <>
            <Flex justifyContent="space-between" align="center">
              {/* Playlist Name */}
              <Flex alignItems="center">
                <RiPlayList2Fill size={"30px"} />
                <Text fontWeight="medium" fontSize="30px" ml={2}>
                  {playlist.name}
                </Text>
              </Flex>
              <Text fontWeight="medium" fontSize="md">
                {playlist.privacy}
              </Text>
            </Flex>
            <Box fontSize="sm" color="white">
              <Text fontWeight="small" fontSize="lg" mb={2}>
                {playlist.description}
              </Text>
              <Flex>
                <Box flex={1}>
                  <Text color="white">
                    <Text>
                    {playlist.numberOfEpisodes} Episodes
                    </Text>{" "}
                  </Text>
                  <Text color="white">
                    <Text>
                      {" "}
                      <b>Duration:</b> {formatSecToDurationString(playlist.duration)}
                    </Text>{" "}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray.500">
                    <Text fontWeight="bold">Created At: {new Date(playlist.createdAt).toLocaleDateString()}</Text>{" "}
                  </Text>
                  <Text color="gray.500">
                    <Text fontWeight="bold">Updated At: {new Date(playlist.updatedAt).toLocaleDateString()}</Text>{" "}
                  </Text>
                </Box>
              </Flex>
              <Flex mt={4}>
                <Button onClick={() => handlePlaylistClick()} leftIcon={<FaPlay />}>
                  Play
                </Button>
                <Button onClick={() => handlePlaylistShuffleClick()} leftIcon={<ImShuffle />} ml={2}>
                  Shuffle
                </Button>
                <Spacer />
                <PlaylistMenu playlist={playlist} onUpdate={updatePlaylistData} />
              </Flex>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mt={2}>
                Episodes:
              </Text>
              {episodes && episodes.length > 0 ? (
                episodes.map((episode: any) => <EpisodeCard episode={episode} inPlaylist={true} playlistId={playlist.id} />)
              ) : (
                <Text textAlign={"center"} mt={"5%"} fontWeight={"bold"}>
                  No episodes in this playlist yet
                </Text>
              )}
            </Box>
          </>
        )}
      </VStack>

  );
}
