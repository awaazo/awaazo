// pages/_app.tsx
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";
import { extendTheme } from "@chakra-ui/react";
import AppTheme from "../styles/customTheme";

const theme = extendTheme({
  colors: {
    primary: {
      1: "#90cdf4",
      2: "#236D73",
    },
    secondary: {
      1: "#81e6d9",
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // 3. Pass the new theme to `ChakraProvider`
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
      />
      <ColorModeScript initialColorMode="dark" />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
