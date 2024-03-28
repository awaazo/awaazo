import React, { useEffect, useState } from "react";
import { Box, Flex, Icon, Image, VStack, Text, Tooltip, IconButton, useBreakpointValue, HStack, Avatar } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "../../public/logos/logo_white.svg";
import { Home, Search, Add, Cards } from '../../public/icons'
import { useRouter } from "next/router";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../types/Interfaces";
import ViewQueueModal from "../playlist/ViewQueueModal";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";
import { PiQueueFill } from "react-icons/pi";
import AuthHelper from "../../helpers/AuthHelper";
import LoginPrompt from "../auth/AuthPrompt";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";

const Sidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const mainContentStyle = {
    marginLeft: "0px",
    marginRight: "3em",
    zIndex: 25,
  };
  const [user, setUser] = useState({
    id: '',
    username: '',
    avatarUrl: '',
  });

  useEffect(() => {
    AuthHelper.authMeRequest().then((response) => {
      if (response.status === 200) {
        setUser(response.userMenuInfo); // Assuming this includes the avatarUrl
      }
    });
  }, []);
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [reload, setReload] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  };
  useEffect(() => {
    const handlePlaylistUpdate = (event) => {
      console.log('Event received', event.detail);
      const updatedPlaylist = event.detail;
      setPlaylists((currentPlaylists) => {
        const newPlaylists = currentPlaylists.map((playlist) => {
          if (playlist.id === updatedPlaylist.id) {
            return { ...playlist, ...updatedPlaylist };
          }
          return playlist;
        });
        console.log('Updated playlists', newPlaylists);
        return newPlaylists;
      });
    };

    window.addEventListener('playlistUpdated', handlePlaylistUpdate);

    return () => {
      window.removeEventListener('playlistUpdated', handlePlaylistUpdate);
    };
  }, []);

  const handleAddPlaylistClick = () => {
    console.log("Clicked");
    // Check login status before opening the modal
    AuthHelper.authMeRequest().then((response) => {
      if (response.status === 401) {
        console.log("User not logged in");
        // Handle not logged in state (e.g., show a login prompt)
        onCreateModalClose();
        setShowLoginPrompt(true);
        return;
      } else {
        // User is logged in, open the modal
        onCreateModalOpen();
      }
    });
  };


  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

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

  const userPlaylists = playlists.filter((playlist) => playlist.isHandledByUser);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const MobileNavigation = () => {
    return (
      <Box position="fixed" right="0" py={2} zIndex={1000} borderTop={"2px solid rgba(255, 255, 255, 0.03)"} bg="rgba(255, 255, 255, 0.04)" backdropFilter="blur(40px)">
        <HStack justify="space-around">
          <Link href="/" passHref>
            <IconButton icon={<Home />} variant="ghost" aria-label="Home" borderRadius="50%" fontSize="18px" />
          </Link>
          <Link href="/Explore/Search" passHref>
            <IconButton icon={<Search />} variant="ghost" aria-label="Search" borderRadius="50%" fontSize="18px" />
          </Link>
          <Link href="/Playlist/" passHref>
            <IconButton icon={<Cards />} variant="ghost" aria-label="Playlist" onClick={onCreateModalOpen} borderRadius="50%" fontSize="18px" />
          </Link>
        </HStack>
      </Box>
    );
  };

  if (isMobile) {
    return <MobileNavigation />;
  } else {
    return (

      <div style={mainContentStyle}>
        <Box
          bg="linear-gradient(180deg, #2D2D2F8C, #1F1F218C)"
          w={collapsed ? "70px" : "15em"}
          h="calc(88vh - 5em)"
          py={10}
          px={collapsed ? 2 : 3}
          position="fixed"
          mt="5em"
          zIndex={10}
          transition="width 0.2s ease-in-out"
          roundedTopRight="25px"
          roundedBottomRight="25px"
          // outline={"2px solid rgba(255, 255, 255, 0.01)"}
          boxShadow={"1px 0px 20px 1px rgba(0, 0, 0, 0.205)"}
          flexDirection="column"
          justifyContent="space-between"
          backdropFilter="blur(15px)"
          bgColor={"rgba(0, 0, 0, 0.2)"}
          border={'2px solid rgba(255, 255, 255, 0.03)'}
        >

          <Flex align={collapsed ? "left" : "center"} p="3" mb="7" borderRadius="md" color={router.pathname === "/Explore/Search" ? "brand.200" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }} ml={collapsed ? "0" : "1em"}>
            <Image src={Logo.src} alt="Logo" w="28px" />
            {/* <Avatar src={user.avatarUrl} name={user.username} /> */}
          </Flex>
          <VStack spacing={"2em"} marginTop={"4em"} align={collapsed ? "center" : "left"}>
            <VStack align={collapsed ? "center" : "left"}>
              {/* Home */}
              <Link href="/" passHref>
                <Flex align={collapsed ? "left" : "center"} p="2" mb="1" borderRadius="md" color={router.pathname === "/" ? "brand.200" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }} ml={collapsed ? "0" : "1em"}>
                  <Icon as={Home} fontSize="xl" mr={collapsed ? "0" : "3"} />
                  {!collapsed && (
                    <Box flex="1" fontWeight="bold">
                      Home
                    </Box>
                  )}
                </Flex>
              </Link>

              {/* Explore */}
              <Link href="/Explore/Search" passHref>
                <Flex align={collapsed ? "left" : "center"} p="2" mb="1" borderRadius="md" color={router.pathname === "/Explore/Search" ? "brand.200" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }} ml={collapsed ? "0" : "1em"}>
                  <Icon as={Search} fontSize="xl" mr={collapsed ? "0" : "3"} />
                  {!collapsed && (
                    <Box flex="1" fontWeight="bold" data-cy={`explore-icon`}>
                      Explore
                    </Box>
                  )}
                </Flex>
              </Link>
            </VStack>

            {/* My Shelf */}
            <Box>
              <Flex justify="center" align="center" p="3" mb="1" borderRadius="md" transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.300" }} onClick={toggleCollapsed} ml={"1em"}>
                <Icon as={Cards} fontSize="xl" mr={3} data-cy={`playlist-icon`} />
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
                        <IconButton icon={<PiQueueFill />} variant={"ghost"} aria-label="View Queue" fontSize={"15px"} onClick={onQueueModalOpen} data-cy={`queue-button`} />{" "}
                      </span>
                    </Tooltip>
                    {/* Conditionally rendering the create playlist button only when login prompt is not visible */}
                    {!showLoginPrompt && (
                      <Tooltip label="Create Playlist" fontSize="small">
                        <span>
                          <IconButton icon={<Add />} variant={"ghost"} aria-label="Add Playlist" fontSize={"15px"} onClick={() => { handleAddPlaylistClick(); onCreateModalOpen(); }} data-cy={`add-playlist-button`} />
                        </span>
                      </Tooltip>
                    )}
                  </Box>
                )}
              </Flex>

              {/* User Playlists */}
              {!showLoginPrompt && userPlaylists.length > 0 && (
                <VStack align="left" spacing={1} mt={4} maxH="calc(100vh - 400px)" overflowY="auto">
                  {userPlaylists.map((playlist) => (
                    <Link href={`/Playlist/${playlist.id}`} key={playlist.id} passHref>
                      <Flex align="center" padding={1} pl={2} borderRadius="5px" _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                        <Image src={`${playlist.coverArt}?v=${playlist.lastUpdated}`} alt="Playlist" boxSize={collapsed ? "24px" : "12"} objectFit="cover" mr={collapsed ? "0" : "2"} borderRadius="8" key={playlist.lastUpdated} />
                        {!collapsed && <Text data-cy={`playlist-${playlist.name}`}>{playlist.name}</Text>}
                      </Flex>
                    </Link>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack >
          <Flex justify="center" align="center" mt={7} mb={collapsed ? 7 : 0} position="relative">
            <IconButton
              icon={collapsed ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
              aria-label={collapsed ? "Open Sidebar" : "Collapse Sidebar"}
              onClick={toggleCollapsed}
              position="absolute"
              right="-30px" // Adjust this value as needed to move the button further to the right
              top="10em"
              transform="translateY(-50%)"
              borderRadius="20px"
              backdropFilter={"blur(40px)"}
              zIndex={10} // Ensure it's above other content
              bgColor={"rgba(0, 0, 0, 0.0)"}
              boxShadow={`inset 0 0 0px rgba(255, 255, 255, 0), inset -2px 0 1px rgba(255, 255, 255, 0.1)`}
              _hover={{
                bgColor: "rgba(255, 255, 255, 0.0)",
                boxShadow: `inset 0 0 0px rgba(255, 255, 255, 0), inset -2px 0 1px rgba(255, 255, 255, 0.2)`,
              }}
            />
          </Flex>
          < ViewQueueModal isOpen={isQueueModalOpen} onClose={onQueueModalClose} />
          <CreatePlaylistModal handleReload={handleReload} isOpen={isCreateModalOpen} onClose={onCreateModalClose} />
          {/* LoginPrompt */}
          {
            showLoginPrompt && (
              <LoginPrompt
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
                infoMessage="To access this feature, you must be logged in. Please log in or create an account."
              />
            )
          }
        </Box >
      </div>
    );
  }
};

export default Sidebar;
