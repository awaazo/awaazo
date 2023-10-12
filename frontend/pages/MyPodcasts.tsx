import { Box, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar"; 

export default function MyPodcasts() {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Box p={4}>My Podcasts Page</Box>
        </Box>
      </Center>
    </>
  );
}
