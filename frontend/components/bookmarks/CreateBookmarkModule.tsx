import { useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import BookmarksHelper from "../../helpers/BookmarksHelper";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Textarea, VStack, useDisclosure,useBreakpointValue } from "@chakra-ui/react";
import { Bookmark } from "../../utilities/Interfaces";
import { EpisodeBookmarkRequest } from "../../utilities/Requests";


// This component represents a bookmark button for an episode
const BookmarkComponent = ({ episodeId, selectedTimestamp }) => {
  // Component Values
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  // Function to handle the bookmark/delete bookmark action
  const handleBookmark = () => {
    console.log("Title : ", newTitle);
    console.log("Note : ", newNote);
    console.log("Selected Timestamp:", selectedTimestamp);
    console.log("Episode ID:", episodeId);

    const request: EpisodeBookmarkRequest = {
      title: newTitle,
      note: newNote, 
      time: selectedTimestamp, 
    };

    BookmarksHelper.postBookmark(episodeId, request).then((response) => {
      if (response.status === 200) {
        console.log("Bookmarked Episode");
      } else {
        console.error("Error bookmarking episode:", response.message);
      }
    });

    setNewTitle("");
    setNewNote("");
  };

  return (
    <>
      <Tooltip label="Bookmark" aria-label="Bookmark tooltip">
        <Button variant={"ghost"} p={2} m={1} leftIcon={<Icon as={CiBookmarkPlus} />} onClick={onOpen}></Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent alignItems="center">
          <ModalHeader>Bookmark</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack position={"relative"}>
              <Textarea value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Add a title..." borderRadius={"1em"} />
              <VStack spacing={1} align="start" width={isMobile ? "150px" : "200px"} height="15px" overflowY="auto"></VStack>
              <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." borderRadius={"1em"} />
              <Button leftIcon={<Icon as={CiBookmarkPlus} />} onClick={handleBookmark} zIndex="1" variant="gradient" marginTop="1em">
                Add Bookmark
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookmarkComponent;
