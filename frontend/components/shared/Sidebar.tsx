import React from "react";
import Logo from "../../public/logo_white.svg";
import MyShelf from "./MyShelf";
import { useBreakpointValue, Box, VStack, Text, Icon, Flex, Image } from "@chakra-ui/react";
import { FaHome, FaSearch, FaHeart, FaMusic, FaUserFriends } from "react-icons/fa";

const Sidebar = () => {
  const sidebarWidth = useBreakpointValue({ base: "100%", md: "60px", lg: "250px" });
  const isMobile = useBreakpointValue({ base: true, md: false, lg: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const SidebarItem = ({ icon, label, isActive }) => (
    <Flex align="center" p="2" mb="1" borderRadius="md" bg={isActive ? "orange.500" : "transparent"} color="white">
      <Icon as={icon} fontSize="lg" mr={3} />
      {(!isMobile && !isTablet) && <Text flex="1">{label}</Text>}
    </Flex>
  );

  return (
    <Box
      bg="rgba(0, 0, 0, 0.3)"
      backdropFilter="blur(35px)"
      borderRightRadius={isMobile ? 0 : 20}
      w={sidebarWidth}
      h={isMobile ? "60px" : "100vh"}
      py={5} px={isMobile || isTablet ? 1 : 4}
      position={isMobile ? "fixed" : "static"}
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      boxShadow="0px 0px 15px rgba(0, 0, 0, 0.3)"
      border="3px solid rgba(255, 255, 255, 0.05)"
      data-testid="navbar-component"
    >
      <Flex mb={10} justify="start" align="center">
        <Image src={Logo.src} alt="Logo" mr={1} w="30px" />
      </Flex>
  
      <VStack align="start" spacing={1}>
        {/* Tablet Layout: Display all icons without labels */}
        {isTablet && (
          <>
            <SidebarItem icon={FaHome} label="" isActive />
            <SidebarItem icon={FaSearch} label="" isActive={false} />
            <MyShelf />
          </>
        )}
  
        {/* Mobile Layout: Limited icons for bottom bar */}
        {isMobile && (
          <>
            <SidebarItem icon={FaHome} label="" isActive />
            <SidebarItem icon={FaSearch} label="" isActive={false} />
            <SidebarItem icon={FaMusic} label="" isActive={false} />
          </>
        )}
  
        {/* Desktop Layout: Full sidebar with labels */}
        {!isMobile && !isTablet && (
          <>
            <SidebarItem icon={FaHome} label="Home" isActive />
            <SidebarItem icon={FaSearch} label="Search" isActive={false} />
            <MyShelf /> 
          </>
        )}
      </VStack>
    </Box>
  );
  
};

export default Sidebar;
