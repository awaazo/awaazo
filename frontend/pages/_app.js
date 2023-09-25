// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
// do not touch this file
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
