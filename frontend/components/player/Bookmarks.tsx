import {
  Box,
  Text,
  VStack,
  Flex,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiBookmark } from "react-icons/fi";

type BookmarkType = {
  title: string;
  timestamp: string;
  content: string;
};

type BookmarkProps = {
  bookmarks: BookmarkType[];
};

const Bookmarks: React.FC<BookmarkProps> = ({ bookmarks }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const iconSize = useBreakpointValue({ base: "16px", md: "20px" });

  return (
    <VStack
      spacing={4}
      p={6}
      rounded="2xl"
      boxShadow="xl"
      backdropBlur="4px"
      width="100%"
      minH="100%"
    >
      <Flex justifyContent="flex-start" alignItems="center" width="100%">
        <Icon as={FiBookmark} boxSize={iconSize} />
        <Text fontSize={fontSize} fontWeight="bold" mr={2}>
          Bookmarks
        </Text>
      </Flex>
      {bookmarks.map((bookmark, idx) => (
        <Box
          key={idx}
          p={4}
          rounded="2xl"
          backdropBlur="2px"
          bg="rgba(255, 255, 255, 0.1)"
          borderColor="rgba(255, 255, 255, 0.05)"
          width="100%"
        >
          <Flex justifyContent="space-between">
            <Text fontWeight="bold">{bookmark.title}</Text>
            <Text color="gray.400">{bookmark.timestamp}</Text>
          </Flex>
          <Text mt={2}>{bookmark.content}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default Bookmarks;
