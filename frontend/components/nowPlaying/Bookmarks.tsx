import { Box, Text, VStack, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { FiBookmark } from "react-icons/fi";
import { Bookmark } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils"; 
import { useState, useEffect } from "react";
import BookmarksHelper from "../../helpers/BookmarksHelper";

interface BookmarkProps {
  episodeId: string;
}

const Bookmarks: React.FC<BookmarkProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [bookmarks, setBookmarks] = useState(null);

  useEffect(() => {
    if (episodeId) {
      BookmarksHelper.getAllBookmarks(episodeId)
        .then((res) => {
          if (res.status === 200) {
            setBookmarks(res.bookmarks);
          } else {
            console.error("Error fetching bookmarks data:", res.message);
          }
        })
        .catch((error) => console.error("Error fetching bookmarks data:", error));
    }
  }, [episodeId]);

  return (
    <Box border="3px solid rgba(255, 255, 255, 0.05)" width="full" height="full" p={2} borderRadius="1.1em">
      {/* Bookmarks header */}
      <Flex justifyContent="flex-start" alignItems="center" m={3} >
        <Icon as={FiBookmark} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2} >
          Bookmarks
        </Text>
      </Flex>
      {/* Render each bookmark */}
      <VStack spacing={3} align="start" overflowY="auto" maxH="100vh">
        {bookmarks.map((bookmark, index) => (
          <Box 
            key={index} 
            bg="rgba(255, 255, 255, 0.02)" 
            borderRadius="2xl"
            p={4}
            _hover={{ bg: "rgba(255, 255, 255, 0.05)" }} 
            w="100%"
          >
            {/* Bookmark title and timestamp */}
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {bookmark.title}
              </Text>
              <Text color="gray.400">
                {convertTime(bookmark.timestamp)}
              </Text>
            </Flex>
            {/* Bookmark note */}
            <Text mt={2}>{bookmark.note}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Bookmarks;
