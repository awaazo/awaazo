import React, {  useEffect, useState } from "react";
import { Box, Flex,  Text, Icon,Image } from "@chakra-ui/react";
import Link from "next/link";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../utilities/Interfaces";
import { PiQueueFill } from "react-icons/pi";
import ViewQueueModal from "./ViewQueueModal";

const PlaylistSidebar = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [reload, setReload] = useState(false);
  const [playlistError, setPlaylistError] = useState("");
  const [isQueueModalOpen, setQueueModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  // Initialize random images for playlists (remove later when we get the endpoint)
  useEffect(() => {
    const newImageUrls = {};
    playlists.forEach((playlist) => {
      newImageUrls[playlist.id] = `https://source.unsplash.com/random/100x100?sig=${playlist.id}`;
    });
    setImageUrls(newImageUrls);
  }, [playlists]);

  
  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(page, pageSize).then((res2) => {
      if (res2.status == 200) {
        setPlaylists(res2.playlists);
      } else {
        setPlaylistError("Podcasts cannot be fetched");
      }
    });
  }, [page, reload]);

  const userPlaylists = playlists.filter((playlist) => playlist.isHandledByUser);

  const handleViewQueue = () => {
    setQueueModalOpen(true);
  };

  const onPlaylistAdded = () => {
    setReload(!reload);
  };

  return (
    <Box w="100%" maxW="400px" h="auto" mt="2" borderRadius="20px" overflowY="auto">
      <Flex direction="column" mb="4">
       
        {userPlaylists && userPlaylists.length === 0 ? (
          <Text textAlign={"center"} mt={5} fontWeight={"bold"}>
            You have no playlists
          </Text>
        ) : (
          userPlaylists &&
          userPlaylists.map((playlist) => (
            <Link href={`/Playlist/${playlist.id}`} key={playlist.id}>
              <Flex align="center" padding={1} pl={2} borderRadius={"5px"} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                <Image src={imageUrls[playlist.id] || "https://via.placeholder.com/100"} alt="Playlist" boxSize="12" mr="2" borderRadius="8" />
                <Text data-cy={`playlist-${playlist.name}`}>{playlist.name}</Text>
              </Flex>
            </Link>
          ))
        )}
        <Flex align="center" padding={1} pl={2} borderRadius={"5px"} _hover={{ bg: "rgba(255, 255, 255, 0.3)", cursor: "pointer" }} onClick={handleViewQueue}>
          <Icon as={PiQueueFill} mr="2" />
          <Text data-cy={`queue-button`}>View Queue</Text>
        </Flex>
        <ViewQueueModal isOpen={isQueueModalOpen} onClose={() => setQueueModalOpen(false)} />
      </Flex>
    </Box>
  );
};

export default PlaylistSidebar;
