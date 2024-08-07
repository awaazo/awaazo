import React from "react";
import { Box, Text, VStack, Flex, useBreakpointValue, Icon, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Bookmark } from "../../../types/Interfaces";
import { convertTime } from "../../../utilities/commonUtils";
import { CiBookmark } from "react-icons/ci";
import BookmarksHelper from "../../../helpers/BookmarksHelper";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

interface BookmarksProps {
  episodeId: string;
}

const Bookmarks: React.FC<BookmarksProps> = ({ episodeId }) => {
  const { t } = useTranslation();
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(null);
  const [deletedBookmark, setDeletedBookmark] = useState();

  //fetch bookmarks every time a new episodeid is set
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



  // Function to handle the bookmark/delete bookmark action
  const handleDeleteBookmark = (bookmarkId) => {
    console.log("id: ", bookmarkId);
    // Send the request to delete bookmark
    BookmarksHelper.deleteEpisodeBookmark(bookmarkId).then((response) => {
      if (response.status === 200) {
        setDeletedBookmark(bookmarkId);
        console.log("Bookmark " + bookmarkId + " deleted");
      } else {
        console.error("Error deleting bookmark", response.message);
      }
    });
  };

  return (
    <Box bg={"az.darkestGrey"} width="100%" height="100%" p={2} borderRadius="1.1em">
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Icon as={CiBookmark} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2}>
          {t('bookmarks.title')}
        </Text>
      </Flex>
      <VStack spacing={3} align="start" overflowY="auto" mb={4} maxH="100vh">
        {bookmarks?.map((bookmark, index) => (
          <Box key={index} bg="rgba(255, 255, 255, 0.02)" borderRadius="2xl" p={4} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }} w="100%">
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {bookmark.title}
              </Text>
              <IconButton icon={<Icon as={FaTrash} />} variant={"ghost"} aria-label="Delete Bookmark" data-cy={`delete-bookmark-id:`} onClick={() => handleDeleteBookmark(bookmark.id)} size="md" />
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="gray.500">
                {convertTime(bookmark.time)}
              </Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="gray.400">
                {bookmark.note}
              </Text>
            </Flex>
          </Box>
        ))}
        {bookmarks && bookmarks.length === 0 && (
          <Text color="gray" mt={'50px'} textAlign={'center'} width={'100%'}>
            {t('bookmarks.no_bookmarks')}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Bookmarks;
