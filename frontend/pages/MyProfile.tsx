// pages/index.tsx
import { Box, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/navbar"; // Import the Navbar component

function myProfile() {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Box p={4}>Profile Page</Box>
        </Box>
      </Center>
    </>
  );
}
export default myProfile;