// pages/index.tsx
import { Box, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar"; // Import the Navbar component

export default function Explore() {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Box p={4}>Explore Page</Box>
        </Box>
      </Center>
    </>
  );
}
