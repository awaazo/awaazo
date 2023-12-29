import { Box, Center, Flex } from "@chakra-ui/react";
import Navbar from "../../components/shared/Navbar";
import PlaylistSidebar from "../../components/playlist/PlaylistSidebar";

export default function MyPlaylistsPage() {
  return (
    <>
      <Navbar />
      <Flex>
        <PlaylistSidebar />
      </Flex>
    </>
  );
}
