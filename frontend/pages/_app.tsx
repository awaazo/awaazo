// pages/_app.tsx
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";
import bg from "../styles/images/bg.png";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ChakraProvider>
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
