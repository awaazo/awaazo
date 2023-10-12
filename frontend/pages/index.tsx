// pages/index.tsx
import { Box, Button, Center, Text } from "@chakra-ui/react";
import Navbar from "../components/shared/Navbar"; 
import AuthHelper from "../helpers/AuthHelper";

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
