import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Profile } from "next-auth";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  useColorModeValue,
  useColorMode,
  Image,
  Input,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  AddIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import LogoWhite from "../../public/logo_white.svg";
import LogoBlack from "../../public/logo_black.svg";
import AuthHelper from "../../helpers/AuthHelper";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { UserMenuInfo } from "../../utilities/Interfaces";

export default function Navbar() {
  const loginPage = "/auth/Login";
  const indexPage = "/";
  const registerPage = "/auth/Signup";
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event) => setSearchValue(event.target.value);

  const handleSearchSubmit = () => {
    const searchlink = "/Explore/Search?searchTerm=" + searchValue;
    window.location.href = searchlink;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserMenuInfo>({
    id: "",
    username: "",
    avatarUrl: "",
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state to track login status
  const [isUserSet, setIsUserSet] = useState(false);

  useEffect(() => {
    // Custom User logged in
    if (!isUserSet) {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status == 200) {
          setUser(response.userMenuInfo);
          setIsUserLoggedIn(true); // Set login status to true
          setIsUserSet(true);
          setIsLoggedIn(true);
        }
      });
    }
    // Google User logged in
    else if (session && !isLoggedIn) {
      AuthHelper.loginGoogleSSO(
        session.user.email,
        session.user.name,
        (session as any).id,
        session.user.image,
      ).then(() => {
        AuthHelper.authMeRequest().then((response) => {
          if (response.status == 200) {
            setUser(response.userMenuInfo);
            setIsUserLoggedIn(true); // Set login status to true
            setIsUserSet(true);
            setIsLoggedIn(true);
          }
        });
      });
    }
  }, [session, isLoggedIn]);

  /**
   * Logs the user out of the application.
   */
  const handleLogOut = async () => {
    AuthHelper.authLogoutRequest();
    // User logged in via Google, so use next-auth's signOut
    if (session) await signOut();

    // Set Logged In Status to false and redirect to index page
    setIsUserLoggedIn(false);
    setIsUserSet(false);
    window.location.href = indexPage;
  };

  const UserProfileMenu = () => (
    <Menu>
      <MenuButton
        aria-label="loggedInMenu"
        as={Button}
        rounded={"full"}
        variant={"link"}
        cursor={"pointer"}
      >
        {user.avatarUrl === "" ? (
          <Avatar
            size={"sm"}
            src={
              "https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            }
            boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
          />
        ) : (
          <Avatar
            size={"sm"}
            src={user.avatarUrl}
            boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(10px)"
          />
        )}
      </MenuButton>
      <MenuList>
        <MenuGroup>
          <MenuItem
            onClick={() => (window.location.href = "/profile/MyProfile")}
          >
            👤 My Account
          </MenuItem>
          <MenuItem onClick={() => (window.location.href = "/MyPodcasts")}>
            🎙️ My Podcasts
          </MenuItem>
          <MenuDivider />

          <MenuItem onClick={() => (window.location.href = "/Settings")}>
            ⚙️ Settings
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem
            onClick={handleLogOut}
            style={{ color: "red", fontWeight: "normal" }}
          >
            Logout
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );

  const LoggedOutMenu = () => (
    <Menu>
      <MenuButton
        menu-id="menuBtn"
        aria-label="Menu"
        as={Button}
        variant={"link"}
        cursor={"pointer"}
      >
        <HamburgerIcon />
      </MenuButton>
      <MenuList>
        <MenuItem
          id="loginBtn"
          onClick={() => (window.location.href = loginPage)}
        >
          Login
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => (window.location.href = registerPage)}>
          Register
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <>
      <Box
        bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.3)")}
        backdropFilter="blur(35px)"
        p={6}
        mr={"2em"}
        ml={"2em"}
        mb={"3em"}
        position="sticky"
        top={5}
        zIndex={999}
        borderRadius={"95px"}
        boxShadow="0px 0px 15px rgba(0, 0, 0, 0.4)"
        data-testid="navbar-component"
        border="3px solid rgba(255, 255, 255, 0.05)"
      >
        <Flex alignItems={"center"} justifyContent={"space-between"} px={6}>
          <Link href="/">
            <Box maxWidth={"1.5em"} ml={-2}>
              <Image
                src={colorMode === "dark" ? LogoWhite.src : LogoBlack.src}
                alt="logo"
              />
            </Box>
          </Link>
          {isMobile ? (
            <Flex alignItems={"center"}>
              <Input
                placeholder="Search"
                size="sm"
                borderRadius="full"
                mr={4}
                value={searchValue}
                onChange={handleSearchChange}
                css={{
                  "::placeholder": {
                    opacity: 1, // increase placeholder opacity
                  },
                }}
              />
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="md"
                rounded={"full"}
                opacity={0.7}
                mr={4}
                color={colorMode === "dark" ? "white" : "black"}
              />
              <UserProfileMenu />
            </Flex>
          ) : (
            <Flex
              alignItems={"center"}
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              color={colorMode === "dark" ? "white" : "black"}
            >
              <Input
                placeholder="Search"
                size="sm"
                borderRadius="full"
                mr={4}
                value={searchValue}
                onChange={handleSearchChange}
                css={{
                  "::placeholder": {
                    opacity: 1, // increase placeholder opacity
                  },
                }}
              />
              <Link href="/Create">
                <IconButton
                  aria-label="Create"
                  icon={<AddIcon />}
                  variant="ghost"
                  size="md"
                  rounded={"full"}
                  opacity={0.7}
                  mr={3}
                  color={colorMode === "dark" ? "white" : "black"}
                />
              </Link>
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="md"
                rounded={"full"}
                opacity={0.7}
                mr={4}
                color={colorMode === "dark" ? "white" : "black"}
              />
              {isUserLoggedIn ? <UserProfileMenu /> : <LoggedOutMenu />}
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}
