import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Image,
  VStack,
  Text,
  Tooltip,
  IconButton,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaHome, FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { VscLibrary } from "react-icons/vsc";
import Logo from "../../public/logo_white.svg";
import { useRouter } from "next/router";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../utilities/Interfaces";
import ViewQueueModal from "../playlist/ViewQueueModal";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { PiQueueFill } from "react-icons/pi";

const Sidebar = () => {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [reload, setReload] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  const handleReload = () => {
    setReload(!reload);
  };

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  useEffect(() => {
    const newImageUrls = {};
    playlists.forEach((playlist) => {
      newImageUrls[
        playlist.id
      ] = `https://source.unsplash.com/random/100x100?sig=${playlist.id}`;
    });
    setImageUrls(newImageUrls);
  }, [playlists]);

  // Queue and Create Playlist Modals
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const onQueueModalClose = () => setIsQueueModalOpen(false);
  const onQueueModalOpen = () => setIsQueueModalOpen(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const onCreateModalClose = () => setIsCreateModalOpen(false);
  const onCreateModalOpen = () => setIsCreateModalOpen(true);

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(0, 20).then((res) => {
      if (res.status === 200) {
        setPlaylists(res.playlists);
      }
    });
  }, [reload]);

  const userPlaylists = playlists.filter(
    (playlist) => playlist.isHandledByUser,
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  const MobileNavigation = () => {
    return (
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        py={2}
        zIndex={1000}
        borderTop="2px solid rgba(255, 255, 255, 0.06)"
        bg="rgba(255, 255, 255, 0.04)"
        style={{ backdropFilter: "blur(50px)" }}
      >
        <HStack justify="space-around">
          {" "}
          <Link href="/" passHref>
            <IconButton icon={<FaHome />} variant="ghost" aria-label="Home" />
          </Link>{" "}
          <Link href="/Explore/Search" passHref>
            <IconButton
              icon={<FaSearch />}
              variant="ghost"
              aria-label="Search"
            />
          </Link>{" "}
          <Link href="/Playlist/MyPlaylists" passHref>
            <IconButton
              icon={<VscLibrary />}
              variant="ghost"
              aria-label="Playlist"
              onClick={onCreateModalOpen}
            />
          </Link>
          <Link href="/profile/MyProfile" passHref>
            <IconButton
              icon={<FaUser />}
              variant="ghost"
              aria-label="Profile"
            />
          </Link>
        </HStack>
      </Box>
    );
  };

  if (isMobile) {
    return <MobileNavigation />;
  } else {
    return (
      <Box
        bg="rgba(255, 255, 255, 0.04)"
        w={collapsed ? "60px" : "15em"}
        h="calc(88vh - 5em)"
        py={8}
        px={collapsed ? 2 : 3}
        position="sticky"
        top="3em"
        zIndex={10}
        transition="width 0.2s ease-in-out"
        roundedTopRight="10px"
        roundedBottomRight="10px"
        // ml={3}
        mt={"2em"}
        outline={"2px solid rgba(255, 255, 255, 0.06)"}
      >
        <Flex justify="center" align="center" mb={7}>
          <Image src={Logo.src} alt="Logo" w="28px" />
        </Flex>
        <VStack align="left" spacing={"1em"}>
          <Box
            p={1}
            bg={"rgba(0, 0, 0, 0.1)"}
            rounded={"xl"}
            width={"100%"}
            outline={"2px solid rgba(255, 255, 255, 0.05)"}
          >
            {/* Home */}
            <Link href="/" passHref>
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                borderRadius="md"
                color={router.pathname === "/" ? "brand.200" : "grey.700"}
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: "none", color: "brand.300" }}
              >
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
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                borderRadius="md"
                color={
                  router.pathname === "/Explore/Search"
                    ? "brand.200"
                    : "grey.700"
                }
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: "none", color: "brand.300" }}
              >
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
          <Box
            p={1}
            bg={"rgba(0, 0, 0, 0.1)"}
            rounded={"xl"}
            width={"100%"}
            outline={"2px solid rgba(255, 255, 255, 0.05)"}
          >
            <Flex
              align="center"
              p="2"
              mb="1"
              borderRadius="md"
              color="grey.700"
              transition="color 0.4s ease-in-out"
              _hover={{ textDecoration: "none", color: "brand.300" }}
              onClick={toggleCollapsed}
            >
              <Icon
                as={VscLibrary}
                fontSize="xl"
                mr={3}
                data-cy={`playlist-icon`}
              />
              {!collapsed && (
                <Box flex="1" fontWeight="bold">
                  My Shelf
                </Box>
              )}
              {!collapsed && (
                <Box onClick={handleModalClick}>
                  {" "}
                  <Tooltip label="View Queue" fontSize="small">
                    <span>
                      <IconButton
                        icon={<PiQueueFill />}
                        variant={"ghost"}
                        aria-label="View Queue"
                        fontSize={"15px"}
                        onClick={onQueueModalOpen}
                        data-cy={`queue-button`}
                      />{" "}
                    </span>
                  </Tooltip>
                  <Tooltip label="Create Playlist" fontSize="small">
                    <span>
                      <IconButton
                        icon={<FaPlus />}
                        variant={"ghost"}
                        aria-label="Add Playlist"
                        fontSize={"15px"}
                        onClick={onCreateModalOpen}
                        data-cy={`add-playlist-button`}
                      />
                    </span>
                  </Tooltip>
                </Box>
              )}
            </Flex>

            {/* User Playlists */}
            {userPlaylists.length > 0 && (
              <VStack
                align="left"
                spacing={1}
                mt={4}
                maxH="calc(100vh - 400px)"
                overflowY="auto"
              >
                {userPlaylists.map((playlist) => (
                  <Link
                    href={`/Playlist/${playlist.id}`}
                    key={playlist.id}
                    passHref
                  >
                    <Flex
                      align="center"
                      padding={1}
                      pl={2}
                      borderRadius="5px"
                      _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <Image
                        src={
                          imageUrls[playlist.id] ||
                          "https://via.placeholder.com/100"
                        }
                        alt="Playlist"
                        boxSize={collapsed ? "24px" : "12"}
                        mr={collapsed ? "0" : "2"}
                        borderRadius="8"
                      />
                      {!collapsed && (
                        <Text data-cy={`playlist-${playlist.name}`}>
                          {playlist.name}
                        </Text>
                      )}
                    </Flex>
                  </Link>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>{" "}
        <ViewQueueModal isOpen={isQueueModalOpen} onClose={onQueueModalClose} />
        <CreatePlaylistModal
          handleReload={handleReload}
          isOpen={isCreateModalOpen}
          onClose={onCreateModalClose}
        />
      </Box>
    );
  }
};

export default Sidebar;
