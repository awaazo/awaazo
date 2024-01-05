import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { DefaultSession } from "next-auth";
import { Box, Flex, Input, Avatar, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuGroup, useBreakpointValue, Spacer } from "@chakra-ui/react";
import { HamburgerIcon, BellIcon, ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import AuthHelper from "../../helpers/AuthHelper";
import Notifications from "../notification/Notifications";
import { UserMenuInfo } from "../../utilities/Interfaces";
import { GoogleSSORequest } from "../../utilities/Requests";
import NotificationHelper from "../../helpers/NotificationsHelper";
import { useRouter } from "next/router";

export default function Navbar() {
  const loginPage = "/auth/Login";
  const indexPage = "/";
  const signupPage = "/auth/Signup";
  const { data: session, status } = useSession();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const currentPath = router.pathname;

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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); 
  const [isUserSet, setIsUserSet] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      const response = await NotificationHelper.NotificationCount();
      if (response !== null && response !== undefined && typeof response === "number") {
        setNotificationCount(response);
      } else {
        console.error("Failed to fetch notification count:", response.message || "No error message available");
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
          setIsUserLoggedIn(true); 
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
                setIsUserLoggedIn(true); 
                setIsUserSet(true);
                setIsLoggedIn(true);
              }
            });
          }
        }
      });
    }
  }, [session, isLoggedIn]);

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

  const UserProfileMenu = () => (
    <Menu>
      <MenuButton aria-label="loggedInMenu" as={Button} rounded={"full"} variant={"link"} cursor={"pointer"}>
        {user.avatarUrl === "" ? (
          <Avatar size={"sm"} src={""} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)" />
        ) : (
          <Avatar size={"sm"} src={user.avatarUrl} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)" bg="rgba(255, 255, 255, 0.2)" backdropFilter="blur(10px)" />
        )}
      </MenuButton>
      <MenuList>
        <MenuGroup>
          <Link href="/profile/MyProfile" passHref>
            <MenuItem>👤 My Account</MenuItem>
          </Link>
          <Link href="/CreatorHub/MyPodcasts" passHref>
            <MenuItem>🎙️ My Podcasts</MenuItem>
          </Link>
          <MenuDivider />
          <Link href="/CreatorHub/AddEpisode" passHref>
            <MenuItem>⚙️ Settings</MenuItem>
          </Link>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem onClick={handleLogOut} style={{ color: "red", fontWeight: "normal" }}>
            Logout
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );

  const LoggedOutMenu = () => (
    <Menu>
      <MenuButton menu-id="menuBtn" aria-label="Menu" as={Button} variant={"link"} cursor={"pointer"}>
        <HamburgerIcon />
      </MenuButton>
      <MenuList>
        <MenuItem id="loginBtn" onClick={() => (window.location.href = loginPage)}>
          Login
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => (window.location.href = signupPage)}>Sign up</MenuItem>
      </MenuList>
    </Menu>
  );

  const NotificationsModal = () => {
    return <Notifications isOpen={isNotificationsOpen} onClose={toggleNotifications} notificationCount={notificationCount} />;
  };

  return (
    <>
      <Box p={2} mr={"2em"} ml={"2em"} mb={"3em"} position="sticky" top={4} zIndex={999} data-testid="navbar-component">
        <Flex justifyContent="space-between">
          <Flex align="center">
            <IconButton aria-label="Back" icon={<ArrowBackIcon />} onClick={() => window.history.back()} variant="ghost" size="md" mr={2} rounded="full" />
            <IconButton aria-label="Forward" icon={<ArrowForwardIcon />} onClick={() => window.history.forward()} variant="ghost" size="md" rounded="full" />
            {!isMobile && currentPath === "/Explore/Search" && (
              <Flex alignItems="center" as="form" onSubmit={handleSearchSubmit} ml={5} width="20vh">
                <Input placeholder="Search" size="sm" borderRadius="full" mr={4} value={searchValue} onChange={handleSearchChange} />
              </Flex>
            )}
          </Flex>
          <Spacer />
          <Flex align="center">
            <IconButton aria-label="Notifications" icon={<BellIcon />} onClick={toggleNotifications} variant="ghost" size="md" rounded={"full"} opacity={0.7} mr={2} />
            {isUserLoggedIn ? <UserProfileMenu /> : <LoggedOutMenu />}
          </Flex>
        </Flex>
        {isNotificationsOpen && <NotificationsModal />}
      </Box>
    </>
  );
}
