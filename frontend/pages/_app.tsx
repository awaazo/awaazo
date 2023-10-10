// pages/_app.tsx
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";
import bg from "../styles/images/bg.png";
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
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
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
