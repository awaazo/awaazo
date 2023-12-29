import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import BookmarksHelper from "../../helpers/BookmarksHelper";
import AuthHelper from "../../helpers/AuthHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Bookmark } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils"; 
import { EpisodeBookmarkRequest } from "../../utilities/Requests";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  VStack,
  useDisclosure,
  Avatar,
  Text,
  HStack,
  Box,
  Input,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";

// This component represents a bookmark button for an episode
const BookmarkComponent = ({ episodeId, selectedTimestamp}) => {
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
    title: newTitle, // Set the title for the new bookmark
    note: newNote, // Set the note for the new bookmark
    time: selectedTimestamp, // Set the timestamp for the new bookmark
  };


  // Send the request
  BookmarksHelper.postBookmark(episodeId, request)
  .then((response) => {
    if (response.status === 200) {
      // Update the UI to reflect the bookmark
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
  <Button
    variant={"ghost"}
    p={2}
    m={1}
    leftIcon={<Icon as={CiBookmarkPlus}/>}
    onClick={onOpen}
  >
  </Button>
</Tooltip>

<Modal isOpen={isOpen} onClose={onClose} size="xl">
  <ModalOverlay />
  <ModalContent
    backdropFilter="blur(40px)"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    alignSelf={"center"}
    padding={"2em"}
    backgroundColor="rgba(255, 255, 255, 0.1)"
    borderRadius={"2em"}
    outlineColor="rgba(255, 255, 255, 0.25)"
  >
    <ModalHeader fontWeight={"light"} fontSize={"1.5em"}>
      Bookmark
    </ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <VStack position={"relative"}>
        <Textarea
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a title..."
          borderRadius={"1em"}
        />
        <VStack
        spacing={1}
        align="start"
        width={isMobile ? "150px" : "200px"}
        height="100px"
        overflowY="auto"
      >
      </VStack>
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          borderRadius={"1em"}
        />
        <Button
          leftIcon={<Icon as={CiBookmarkPlus} />}
          colorScheme="blue"
          onClick={handleBookmark}
          zIndex="1"
          fontSize="md"
          borderRadius={"full"}
          minWidth={"10em"}
          color={"white"}
          marginTop={"15px"}
          marginBottom={"10px"}
          padding={"20px"}
          outline={"1px solid rgba(255, 255, 255, 0.6)"}
          style={{
            background:
              "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
            backgroundSize: "300% 300%",
            animation: "Gradient 10s infinite linear",
          }}
        >
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
