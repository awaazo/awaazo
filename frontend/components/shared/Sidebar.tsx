import React from "react";
import { useBreakpointValue, Box, VStack, Flex, Icon, Image, useMediaQuery } from "@chakra-ui/react";
import { FaHome, FaSearch } from "react-icons/fa";
import Logo from "../../public/logo_white.svg";
import MyShelf from "../playlist/PlaylistSidebar";
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const [isLargerThanTablet] = useMediaQuery("(min-width: 48em)");

  const sidebarWidth = useBreakpointValue({ base: "100%", md: "60px", lg: "300px" });
  const menuItems = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaSearch, label: "Explore", href: "/Explore/Search" },
  ];

  const SidebarItem = ({ icon, label, href }) => {
    const isActive = router.pathname === href;
    const displayLabel = isLargerThanTablet ? label : '';

    return (
      <Link href={href} passHref>
        <Flex as="a" align="center" p="2" mb="1" borderRadius="md" color={isActive ? "brand.100" : "grey.700"} transition="color 0.4s ease-in-out" _hover={{ textDecoration: 'none', color: 'brand.100' }}>
          <Icon as={icon} fontSize="xl" mr={3} />
          <Box flex="1">{displayLabel}</Box>
        </Flex>
      </Link>
    );
  };

  return (
    <Box
      bg="rgba(0, 0, 0, 0.3)"
      backdropFilter="blur(35px)"
      w={sidebarWidth}
      h="100vh"
      py={8} px={5}
      position="static"
      zIndex={10}
      data-testid="navbar-component"
    >
      <Flex mb={10} justify="start" align="center">
        <Image src={Logo.src} alt="Logo" mr={1} w="30px" />
      </Flex>

      <VStack align="start" spacing={1}>
        {menuItems.map(item => (
          <SidebarItem key={item.label} {...item} />
        ))}

        {isLargerThanTablet && <MyShelf />}
      </VStack>
    </Box>
  );
};

export default Sidebar;
