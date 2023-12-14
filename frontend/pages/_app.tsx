// pages/_app.tsx
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";
import { extendTheme } from "@chakra-ui/react";
import { PlayerProvider } from "../utilities/PlayerContext";
import PlayerBar from "../components/shared/PlayerBar";

const theme = extendTheme({
  colors: {
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
  return (
    <ChakraProvider theme={theme}>
      <meta name="referrer" content="no-referrer" />
      <Box position="absolute" top="0" left="0" width="100%" height="100vh" backgroundImage={bg.src} backgroundSize="cover" zIndex="-1" minHeight="100vh" />
      <ColorModeScript initialColorMode="dark" />
      <SessionProvider session={session}>
        <PlayerProvider>
          <Component {...pageProps} />
          <PlayerBar />
        </PlayerProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
