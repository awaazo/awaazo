import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { DefaultSession } from "next-auth";
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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, AddIcon, HamburgerIcon, BellIcon } from "@chakra-ui/icons";
import LogoWhite from "../../public/logo_white.svg";
import LogoBlack from "../../public/logo_black.svg";
import AuthHelper from "../../helpers/AuthHelper";
import { UserMenuInfo } from "../../utilities/Interfaces";
import { GoogleSSORequest } from "../../utilities/Requests";
import Notifications from "../../pages/notification/Notifications";
import NextLink from "next/link";
import NotificationHelper from "../../helpers/NotificationsHelper";


/**
 * The Navbar component displays the navigation bar at the top of the page.
 * It includes functionality for user authentication, search, and menu options.
 */
export default function Navbar() {
  const loginPage = "/auth/Login";
  const indexPage = "/";
  const registerPage = "/auth/Signup";
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [searchValue, setSearchValue] = useState("");

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      const response = await NotificationHelper.NotificationCount();
      if (response !== null && response !== undefined && typeof response === 'number') {
        setNotificationCount(response);
      } else {
        console.error("Failed to fetch notification count:", response.message || 'No error message available');
      }
    };

    fetchNotificationCount();
  }, []);

  interface SessionExt extends DefaultSession {
    token: {
      email: string;
      sub: string;
      id_token: string;
      name: string;
      picture: string;
    };
  }

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
    if (session !== null && session !== undefined && !isLoggedIn) {
      // Get the session info
      const currentSession = session as SessionExt;
      const googleSSORequest: GoogleSSORequest = {
        email: currentSession.token.email,
        sub: currentSession.token.sub,
        token: currentSession.token.id_token,
        avatar: currentSession.token.picture,
        name: currentSession.token.name,
      };

      AuthHelper.loginGoogleSSO(googleSSORequest).then((response) => {
        if (response.status == 200) {
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
        }
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

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  /**
   * Shows the Basic info about the user currently logged in and gives access to btns.
   * @returns User Profile Menu for the top-right corner
   */
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
          <NextLink href="/profile/MyProfile" passHref>
            <MenuItem>👤 My Account</MenuItem>
          </NextLink>
          <NextLink href="/MyPodcasts" passHref>
            <MenuItem>🎙️ My Podcasts</MenuItem>
          </NextLink>
          <MenuDivider />
          <NextLink href="/Create" passHref>
            <MenuItem>⚙️ Settings</MenuItem>
          </NextLink>
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

  /**
   * Shows login and register options for the user to eventually log in.
   * @returns Logged Out Meny for the top-right corner
   */
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

  const NotificationsModal = () => {
    return(
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={toggleNotifications} 
        notificationCount={notificationCount}
      />
    );
    };

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
              {isUserLoggedIn ? <UserProfileMenu /> : <LoggedOutMenu />}
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
             <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                onClick={toggleNotifications}
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
        {isNotificationsOpen && <NotificationsModal />}
      </Box>
    </>
  );
}
