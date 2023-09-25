// pages/index.js
import { Box, Center, ChakraProvider, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar"; // Import the Navbar component

export default function Home() {
  return (
    <ChakraProvider>
      <Navbar /> {/* Include the Navbar */}
      <Center h="100vh">
        <Box>
          <Text fontSize="3xl" fontWeight="bold">
            Hello, World!
          </Text>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
