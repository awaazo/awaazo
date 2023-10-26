// pages/_app.tsx
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";
import { extendTheme } from "@chakra-ui/react"
import LoggedInRoute from "../components/shared/LoggedInRoute";

const theme = extendTheme({
  colors: {
    primary: {
      1: "#90cdf4",
      2: "#236D73",
    },
    secondary:{
      1: "#81e6d9",
    },
  },
})


function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  // Routes that require a user to be logged in.
  const protectedRoutes = ['/profile/MyProfile','/profile/EditProfile','/Setup'];

  return (
    // 3. Pass the new theme to `ChakraProvider`
    <ChakraProvider theme={theme}>
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
          <LoggedInRoute protectedRoutes={protectedRoutes} >
            <Component {...pageProps} />
          </LoggedInRoute>
        </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
