import React, { useEffect, useState } from "react";
import { Box, Flex, Icon, Image, VStack, Text, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";
import { VscLibrary } from "react-icons/vsc";
import Logo from "../../public/logo_white.svg";
import { useRouter } from "next/router";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../utilities/Interfaces";
import ViewQueueModal from "../playlist/ViewQueueModal";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";

const Sidebar = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [reload, setReload] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  useEffect(() => {
    const newImageUrls = {};
    playlists.forEach((playlist) => {
      newImageUrls[playlist.id] = `https://source.unsplash.com/random/100x100?sig=${playlist.id}`;
    });
    setImageUrls(newImageUrls);
  }, [playlists]);

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(0, 20).then((res) => {
      if (res.status === 200) {
        setPlaylists(res.playlists);
      }
    });
  }, [reload]);

  const userPlaylists = playlists.filter((playlist) => playlist.isHandledByUser);

  return (
    <Box
      bg="rgba(255, 255, 255, 0.07)"
      w={collapsed ? "60px" : "100%"}
      h="calc(88vh - 4em)"
      py={8}
      px={collapsed ? 2 : 3}
      position="sticky"
      top="0"
      zIndex={10}
      transition="width 0.2s ease-in-out" 
      rounded="15px"
      ml={3}
      mt={"2em"}
      outline={"2px solid rgba(255, 255, 255, 0.15)"}
    >
      <Flex justify="center" align="center" mb={7}>
        <Image src={Logo.src} alt="Logo" w="28px" />
      </Flex>

      <VStack align="left" spacing={"1em"}>
        <Box p={1} bg={"rgba(0, 0, 0, 0.1)"} rounded={"xl"} width={"100%"} outline={"2px solid rgba(255, 255, 255, 0.05)"}>
          {/* Home */}
          <Link href="/" passHref>
            <Flex as={Flex} align="center" p="2" mb="1" borderRadius="md" color={router.pathname === "/" ? "brand.200" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }}>
              <Icon as={FaHome} fontSize="xl" mr={3} />
              {!collapsed && (
                <Box flex="1" fontWeight="bold">
                  Home
                </Box>
              )}
            </Flex>
          </Link>

          {/* Explore */}
          <Link href="/Explore/Search" passHref>
            <Flex as={Flex} align="center" p="2" mb="1" borderRadius="md" color={router.pathname === "/Explore/Search" ? "brand.200" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }}>
              <Icon as={FaSearch} fontSize="xl" mr={3} />
              {!collapsed && (
                <Box flex="1" fontWeight="bold" data-cy={`explore-icon`}>
                  Explore
                </Box>
              )}
            </Flex>
          </Link>
        </Box>

        {/* My Shelf */}
        <Box p={1} bg={"rgba(0, 0, 0, 0.1)"} rounded={"xl"} width={"100%"} outline={"2px solid rgba(255, 255, 255, 0.05)"}>
          <Flex align="center" p="2" mb="1" borderRadius="md" color="grey.700" transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }} onClick={toggleCollapsed}>
            <Icon as={VscLibrary} fontSize="xl" mr={3} data-cy={`playlist-icon`}/>
            {!collapsed && (
              <Box flex="1" fontWeight="bold">
                My Shelf
              </Box>
            )}
            {!collapsed && (
              <Box onClick={handleModalClick}>
                <Tooltip label="View Queue" fontSize="small">
                  <span>
                    <ViewQueueModal />
                  </span>
                </Tooltip>
                <Tooltip label="Create Playlist" fontSize="small">
                  <span>
                    <CreatePlaylistModal />
                  </span>
                </Tooltip>
              </Box>
            )}
          </Flex>

          {/* User Playlists */}
          {userPlaylists.length > 0 && (
            <VStack align="left" spacing={1} mt={4} maxH="calc(100vh - 400px)" overflowY="auto">
              {userPlaylists.map((playlist) => (
                <Link href={`/Playlist/${playlist.id}`} key={playlist.id} passHref>
                  <Flex align="center" padding={1} pl={2} borderRadius="5px" _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                    <Image src={imageUrls[playlist.id] || "https://via.placeholder.com/100"} alt="Playlist" boxSize={collapsed ? "24px" : "12"} mr={collapsed ? "0" : "2"} borderRadius="8" />
                    {!collapsed && <Text data-cy={`playlist-${playlist.name}`}>{playlist.name}</Text>}
                  </Flex>
                </Link>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
