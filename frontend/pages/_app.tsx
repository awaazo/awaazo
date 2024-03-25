import { useEffect, useState } from "react";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "../utilities/PlayerContext";
import PlayerBar from "../components/shared/PlayerBar";
import Sidebar from "../components/shared/Sidebar";
import Navbar from "../components/shared/Navbar";
import AppTheme from "../styles/AppTheme";
import { useRouter } from "next/router";
import ColorModeFix from "../styles/ColorModeFix";
import { PanelProvider } from "../utilities/PanelContext";
import Panel from "../components/shared/Panel";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  ColorModeFix();
  const router = useRouter();
  const [showPlayerBar, setShowPlayerBar] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    const path = router.pathname;
    const hidePlayerBarOnPaths = [
      "/auth/",
      "/profile/ProfileSetup",
      "/CreatorHub/",
    ];
    const hideNavbarOnPaths = ["/auth/"];
    const hideSidebarOnPaths = ["/auth/", "/profile/ProfileSetup"];
    const hidePanelOnPaths = [
      "/auth/",
      "/profile/ProfileSetup",
      "/CreatorHub/",
    ];

    const shouldHidePlayerBar = hidePlayerBarOnPaths.some((p) =>
      path.startsWith(p),
    );
    const shouldHideNavbar = hideNavbarOnPaths.some((p) => path.startsWith(p));
    const shouldHideSidebar = hideSidebarOnPaths.some((p) =>
      path.startsWith(p),
    );
    const shouldHidePanel = hidePanelOnPaths.some((p) => path.startsWith(p));

    setShowPlayerBar(!shouldHidePlayerBar);
    setShowNavbar(!shouldHideNavbar);
    setShowSidebar(!shouldHideSidebar);
    setShowPanel(!shouldHidePanel);
  }, [router.pathname]);

  return (
    <ChakraProvider theme={AppTheme}>
      <meta name="referrer" content="no-referrer" />
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100vh"
        backgroundSize="cover"
        zIndex="-1"
        minHeight="100vh"
        bgColor={"#1D1D1D"}
      />
      <SessionProvider session={session}>
        <PlayerProvider>
          <PanelProvider>
            <Flex>
              {showSidebar && <Sidebar />}
              <Box zIndex={"1"}>{showPanel && <Panel />}</Box>
              <Box flex="1">
                {showNavbar && <Navbar />}
                <Component {...pageProps} />
                <Box h="100px" zIndex={"2"} />
                {showPlayerBar && <PlayerBar />}
              </Box>
            </Flex>
          </PanelProvider>
        </PlayerProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
