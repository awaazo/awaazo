import { Box, Text, VStack, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { FiBookmark } from "react-icons/fi";
import { Bookmark } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils"; 

// Interface for the props of the Bookmarks component
interface BookmarkProps {
  bookmarks: Bookmark[]; // Array of bookmarks
}

// Bookmarks component
const Bookmarks: React.FC<BookmarkProps> = ({ bookmarks }) => {
  // Get the appropriate font size and icon size based on the breakpoint value
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const iconSize = useBreakpointValue({ base: "16px", md: "20px" });

  return (
    <VStack spacing={4} p={6} rounded="2xl" backdropBlur="4px" width="100%" minH="100%" overflowY="auto" mb={4} maxH="28vh">
      {/* Bookmarks header */}
      <Flex justifyContent="flex-start" alignItems="center" width="100%">
        <Icon as={FiBookmark} boxSize={iconSize} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2} mr={2}>
          Bookmarks
        </Text>
      </Flex>
      {/* Render each bookmark */}
      {bookmarks.map((bookmark, idx) => (
        <Box key={idx} p={4} rounded="2xl" backdropBlur="2px" bg="rgba(255, 255, 255, 0.1)" borderColor="rgba(255, 255, 255, 0.05)" width="100%">
          {/* Bookmark title and timestamp */}
          <Flex justifyContent="space-between">
            <Text fontWeight="bold">{bookmark.title}</Text>
            <Text color="gray.400">{convertTime(bookmark.timestamp)}</Text> 
          </Flex>
          {/* Bookmark note */}
          <Text mt={2}>{bookmark.note}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default Bookmarks;
