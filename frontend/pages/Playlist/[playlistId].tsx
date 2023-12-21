import { Box, Center, Flex } from "@chakra-ui/react";
import Navbar from "../../components/shared/Navbar";
import PlaylistSidebar from "../../components/playlist/PlaylistSidebar";
import { useRouter } from "next/router";
import PlaylistOverview from "../../components/playlist/PlaylistOverview";

export default function Playlist() {
  const router = useRouter();
  const { playlistId } = router.query;

  return (
    <>
      <Navbar />
      <Flex>
        <Box w="20%" position="fixed">
          {" "}
          {/* Adjust the width of the sidebar as needed */}
          <PlaylistSidebar />
        </Box>
        <Box flex="1" p="8" ml={"20%"}>
          {" "}
          {/* The remaining space */}
          <PlaylistOverview playlistId={playlistId as string} />
        </Box>
      </Flex>
    </>
  );
}
