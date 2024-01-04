import React, { useState } from "react";
import { Box, Flex, Icon, Image, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";
import { RiBookLine } from "react-icons/ri";
import Logo from "../../public/logo_white.svg";
import MyShelf from "../playlist/PlaylistSidebar";
import { useRouter } from "next/router";
import CreatePlaylistModal from "../playlist/CreatePlaylistModal";

const Sidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [reload, setReload] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  const onPlaylistAdded = () => {
    setReload(!reload);
  };
  const handleModalClick = (event) => {
    event.stopPropagation(); 
  };

  return (
    <Box bg="rgba(0, 0, 0, 0.3)" backdropFilter="blur(35px)" w={collapsed ? "60px" : "300px"} h="100vh" py={8} px={collapsed ? 2 : 5} position="sticky" top="0" zIndex={10} display={{ base: "none", md: "block" }} transition="width 0.4s ease-in-out">
      <Flex justify="center" align="center" mb={5}>
        <Image src={Logo.src} alt="Logo" w="30px" />
      </Flex>

      <VStack align="left" spacing={1}>
        <Box p={1} bg={"black"} rounded={"xl"} width={"100%"}>
          {/* Home */}
          <Link href="/" passHref>
            <Flex as={Flex} align="center" p="2" mb="1" borderRadius="md" color={router.pathname === "/" ? "brand.100" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.100" }}>
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
            <Flex as={Flex} align="center" p="2" mb="1" borderRadius="md" color={router.pathname === "/Explore/Search" ? "brand.100" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.100" }}>
              <Icon as={FaSearch} fontSize="xl" mr={3} />
              {!collapsed && (
                <Box flex="1" fontWeight="bold">
                  Explore
                </Box>
              )}
            </Flex>
          </Link>
        </Box>

        <Box p={1} bg={"black"} rounded={"xl"} width={"100%"}>
          {/* My Shelf */}
          <Flex align="center" p="2" mb="1" borderRadius="md" color="grey.700" transition="color 0.4s ease-in-out" _hover={{ textDecoration: "none", color: "brand.100" }} onClick={toggleCollapsed}>
          <Icon as={RiBookLine} fontSize="xl" mr={3} />
          {!collapsed && (
            <Box flex="1" fontWeight="bold">
              My Shelf
            </Box>
          )}
          {!collapsed && (
            <Box onClick={handleModalClick}>
              <CreatePlaylistModal onPlaylistAdded={onPlaylistAdded} />
            </Box>
          )}
        </Flex>
          {!collapsed && (
            <Box overflowY="auto" maxHeight="calc(100vh - 350px)" w="100%">
              <MyShelf />
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
