// pages/index.tsx
import { Box, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar"; // Import the Navbar component

export default function Home() {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Text fontSize="3xl" fontWeight="bold">
            Hello, World!
          </Text>
        </Box>
      </Center>
    </>
  );
}
