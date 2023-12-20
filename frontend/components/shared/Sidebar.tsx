import React from "react";

import Logo from "../../public/logo_white.svg";
import { Box, VStack, Text, Icon, Flex, Image, Divider, Stack, Link } from "@chakra-ui/react";
import { FaHome, FaSearch, FaHeart, FaMusic,  FaUserFriends, FaCog, FaBroadcastTower, FaSignOutAlt } from "react-icons/fa";

const SidebarSection = ({ children }) => (
  <Text fontSize="xs" fontWeight="bold" letterSpacing="wider" color="gray.400" my={3}>
    {children}
  </Text>
);

const SidebarItem = ({ icon, label, isActive }) => (
  <Flex align="center" p="2" mb="1" borderRadius="md" bg={isActive ? "orange.500" : "transparent"} color="white">
    <Icon as={icon} fontSize="lg" mr={3} />
    <Text flex="1">{label}</Text>
  </Flex>
);

const Sidebar = () => {
  return (
    <Box bg={"rgba(0, 0, 0, 0.3)"}
    backdropFilter="blur(35px)" borderRightRadius={20} w="250px" color="white" py={5} px={4} h="100vh" boxShadow="0px 0px 15px rgba(0, 0, 0, 0.3)"
    data-testid="navbar-component"
    border="3px solid rgba(255, 255, 255, 0.05)">
      <Flex mb={10} justify="start" align="center">
        <Image src={Logo.src} alt="Logo" mr={1} w="30px"  />
       
      </Flex>
      <VStack align="start" spacing={1}>
        <SidebarSection>MENU</SidebarSection>
        <SidebarItem icon={FaHome} label="Home" isActive />
        <SidebarItem icon={FaSearch} label="Search" isActive={false} />
        
        <Divider my={5} />
        <SidebarItem icon={FaHeart} label="Likes" isActive={false} />
        <SidebarItem icon={FaMusic} label="Playlists" isActive={false} />
        <SidebarItem icon={FaUserFriends} label="Albums" isActive={false} />
        <SidebarItem icon={FaUserFriends} label="Following" isActive={false} />

        <SidebarSection>GENERAL</SidebarSection>
        <SidebarItem icon={FaCog} label="Settings" isActive={false} />
        <SidebarItem icon={FaSignOutAlt} label="Log out" isActive={false} />

        <Divider my={5} />
      </VStack>

    </Box>
  );
};

export default Sidebar;
