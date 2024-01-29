import { useEffect, useState } from "react";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "../utilities/PlayerContext";
import PlayerBar from "../components/shared/PlayerBar";
import Sidebar from "../components/shared/Sidebar";
import Navbar from "../components/shared/Navbar";
import AppTheme from "../styles/AppTheme";
import { useRouter } from "next/router";
import ColorModeFix from "../styles/ColorModeFix";
import { ChatBotProvider } from "../utilities/ChatBotContext";
import  ChatBot  from "../components/shared/ChatBot";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  ColorModeFix();
  const router = useRouter();
  const [showPlayerBar, setShowPlayerBar] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatBot, setShowChatBot] = useState(true);

  useEffect(() => {
    const path = router.pathname;
    const hidePlayerBarOnPaths = [
      "/auth/",
      "/profile/ProfileSetup",
      "/CreatorHub/",
    ];
    const hideNavbarOnPaths = ["/auth/"];
    const hideSidebarOnPaths = ["/auth/", "/profile/ProfileSetup"];
    const hideChatBotOnPaths = [
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
    const shouldHideChatBot = hideChatBotOnPaths.some((p) =>
      path.startsWith(p),
    );

    setShowPlayerBar(!shouldHidePlayerBar);
    setShowNavbar(!shouldHideNavbar);
    setShowSidebar(!shouldHideSidebar);
    setShowChatBot(!shouldHideChatBot);
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
        backgroundImage={bg.src}
        backgroundSize="cover"
        zIndex="-1"
        minHeight="100vh"
        bgColor={"black"}
      />
      <SessionProvider session={session}>
        <PlayerProvider>
          <ChatBotProvider>
            <Flex>
              {showSidebar && <Sidebar />}
              {showChatBot && <ChatBot />}
              <Box flex="1">
                {showNavbar && <Navbar />}
                <Component {...pageProps} />
                <Box h="100px" />
                {showPlayerBar && <PlayerBar />}
              </Box>
            </Flex>
          </ChatBotProvider>
        </PlayerProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
