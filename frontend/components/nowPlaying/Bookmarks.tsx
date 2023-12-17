import { Box, Text, VStack, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { FiBookmark } from "react-icons/fi";
import { Bookmark } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils"; 

interface BookmarkProps {
  bookmarks: Bookmark[];
}

const Bookmarks: React.FC<BookmarkProps> = ({ bookmarks }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });

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
        {bookmarks.map((bookmark, idx) => (
          <Box 
            key={idx} 
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
