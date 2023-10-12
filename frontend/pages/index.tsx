import { Box, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar"; 

export default function Home() {
  return (
    <>
      <Navbar />
      <Center h="100vh">
        <Box>
          <Box p={4}>Main Content Here</Box>
        </Box>
      </Center>
    </>
  );
}
