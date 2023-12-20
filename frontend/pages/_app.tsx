import { useEffect, useState } from 'react';
import { Box, ChakraProvider } from "@chakra-ui/react";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";
import { extendTheme } from "@chakra-ui/react";
import { PlayerProvider } from "../utilities/PlayerContext";
import PlayerBar from "../components/shared/PlayerBar";
import { useRouter } from "next/router";
import '../styles/globals.css';

const theme = extendTheme({
  colors: {
    brand: {
      100: "#ffcd00",
      200: "#1a202c",
    },
    primary: {
      1: "#90cdf4",
      2: "#236D73",
    },
    secondary: {
      1: "#81e6d9",
    },
    background: {
      light: "rgba(255, 255, 255, 0.2)",
      dark: "rgba(0, 0, 0, 0.2)",
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [showPlayerBar, setShowPlayerBar] = useState(true);


  useEffect(() => {
    const path = router.pathname;
    const hidePlayerBarOnPaths = [
      "/auth/", "/AddEpisode", "/AddEpisodeAI", 
      "/profile/ProfileSetup", "/CreatorHub/"
    ];

    const shouldHidePlayerBar = hidePlayerBarOnPaths.some((p) => path.startsWith(p));
    setShowPlayerBar(!shouldHidePlayerBar);
  }, [router.pathname]); 
  return (
    <ChakraProvider theme={theme}>
      <meta name="referrer" content="no-referrer" />
      <Box position="fixed" top="0" left="0" width="100%" height="100vh" backgroundImage={bg.src} backgroundSize="cover" zIndex="-1" minHeight="100vh" backgroundColor="black" />
      <SessionProvider session={session}>
        <PlayerProvider>
          <Component {...pageProps} />
          {showPlayerBar && <PlayerBar />}
        </PlayerProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
