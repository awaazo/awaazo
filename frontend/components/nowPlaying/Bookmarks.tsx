import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SectionHelper from "../../helpers/SectionHelper";
import { Bookmark, Episode } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";
import { LuBookCopy } from "react-icons/lu";
import BookmarksHelper from "../../helpers/BookmarksHelper";

interface BookmarksProps {
  episodeId: string;
}

const Bookmarks: React.FC<BookmarksProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(null);

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
        .catch((error) =>
          console.error("Error fetching bookmarks data:", error),
        );
    }
  }, [episodeId]);

  return (
    <Box
      border="3px solid rgba(255, 255, 255, 0.05)"
      width="100%"
      height="100%"
      p={2}
      borderRadius="1.1em"
    >
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Icon as={LuBookCopy} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2}>
          Bookmarks
        </Text>
      </Flex>
      <VStack spacing={3} align="start" overflowY="auto" mb={4} maxH="100vh">
        {bookmarks?.map((bookmark, index) => (
          <Box
            key={index}
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="2xl"
            p={4}
            _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
            w="100%"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {bookmark.title}
              </Text>
              <Text color="gray.400">{convertTime(bookmark.time)}</Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Bookmarks;
