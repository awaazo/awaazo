import { Box, Center } from "@chakra-ui/react";
import Navbar from "../../components/shared/Navbar";

export default function MyPlaylists() {
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
