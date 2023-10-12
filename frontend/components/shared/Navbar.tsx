import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useColorMode,
  Image,
  MenuGroup,
  Input,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import LogoWhite from "../../public/logo_white.svg";
import LogoBlack from "../../public/logo_black.svg";
import Link from "next/link";
import AuthHelper from "../../helpers/AuthHelper";

export default function Navbar() {
  const loginPage = "/auth/Login";

  const { colorMode, toggleColorMode } = useColorMode();

  const handleColorModeToggle = () => {
    toggleColorMode();
  };
  const handleLogOut = () => {
    // Log out the user
    AuthHelper.logout();
    // Go to login page
    window.location.href = loginPage;
  };

  // Check if user is logged In
  const isLoggedIn = AuthHelper.getToken();
  console.log();

  return (
    <Box
      bg={useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)")}
      backdropFilter="blur(35px)"
      p={4}
      m={3}
      position="sticky"
      top={0}
      zIndex={999}
      borderRadius={"25px"}
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} px={6}>
        <HStack spacing={8}>
          <Link href="/Main">
            <Box maxWidth={"1.5em"} ml={-2}>
              {" "}
              {/* Negative margin to counter the padding for the logo */}
              <Image
                src={colorMode === "dark" ? LogoWhite.src : LogoBlack.src}
                alt="logo"
              />
            </Box>
          </Link>
        </HStack>
        <Flex alignItems={"center"}>
          <Input placeholder="Search" size="sm" borderRadius="full" mr={4} />
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={handleColorModeToggle}
            variant="ghost"
            size="md"
            rounded={"full"}
            opacity={0.7}
            mr={4}
          />
          <Link href="/Create">
            <IconButton
              aria-label="Create"
              icon={<AddIcon />}
              variant="ghost"
              size="md"
              rounded={"full"}
              opacity={0.7}
              mr={4}
              color={colorMode === "dark" ? "white" : "black"}
            />
          </Link>
          <></>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar
                size={"sm"}
                src={
                  "https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                }
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                bg="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(10px)"
              />
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem>UserName</MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => (window.location.href = "/profile/MyProfile")}
                >
                  My Account
                </MenuItem>
                <MenuItem
                  onClick={() => (window.location.href = "/profile/MyPodcast")}
                >
                  My Podcast
                </MenuItem>
                <MenuItem>Payments</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Help">
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={handleLogOut}
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
