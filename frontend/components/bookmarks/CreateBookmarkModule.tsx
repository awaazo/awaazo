import { useState, FormEvent } from "react";
import { CiBookmark, CiBookmarkPlus } from "react-icons/ci";
import BookmarksHelper from "../../helpers/BookmarksHelper";
import { convertTime } from "../../utilities/commonUtils";
import { EpisodeBookmarkRequest } from "../../utilities/Requests";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Icon,
  FormControl,
  Textarea,
  VStack,
  Flex,
  Text,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";

// This component represents a bookmark modal for an episode
const BookmarkComponent = ({ episodeId, selectedTimestamp }) => {
  // Component Values
  const [isModalOpen, setModalOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [bookmarkError, setBookmarkError] = useState("");
  const [titleCharacterCount, setTitleCharacterCount] = useState<number>(0);
  const [noteCharacterCount, setNoteCharacterCount] = useState<number>(0);

  // Function to handle the bookmark/delete bookmark action
  const handleBookmark = (e: FormEvent) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (newTitle == "" || newNote == "") {
      setBookmarkError("Bookmark Title and Note are Both Required");
      return;
    } else {
      setBookmarkError("");
    }

    const request: EpisodeBookmarkRequest = {
      title: newTitle, // Set the title for the new bookmark
      note: newNote, // Set the note for the new bookmark
      time: selectedTimestamp, // Set the timestamp for the new bookmark
    };

    // Send the request
    BookmarksHelper.postBookmark(episodeId, request).then((response) => {
      if (response.status === 200) {
        setNewTitle("");
        setNewNote("");
        setModalOpen(false);
        console.log("Bookmarked Episode");
      } else {
        console.error("Error bookmarking episode:", response.message);
      }
    });
  };

  // Ensures bookmark title is not longer than 25 characters
  const handleBookmarkTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTitleSliced = e.target.value.slice(0, 25);
    setNewTitle(newTitleSliced);
    setTitleCharacterCount(newTitleSliced.length);
  };

  // Ensures bookmark note is not longer than 250 characters
  const handleBookmarkNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newNoteSliced = e.target.value.slice(0, 250);
    setNewNote(newNoteSliced);
    setNoteCharacterCount(newNoteSliced.length);
  };

  return (
    <>
      <Tooltip label="Bookmark" aria-label="Bookmark tooltip">
        <Button
          p={2}
          m={1}
          variant={"ghost"}
          onClick={() => setModalOpen(true)}
        >
          {" "}
          <Icon as={CiBookmark} boxSize={"20px"} />
        </Button>
      </Tooltip>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} size="sm">
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
            {bookmarkError && <Text color="red.500">{bookmarkError}</Text>}
            <VStack spacing={5} align="center" p={5}>
              <FormControl position="relative">
                <Input
                  placeholder="Enter A Title"
                  rounded="lg"
                  pr="50px"
                  value={newTitle}
                  onChange={handleBookmarkTitleChange}
                />
                <Text
                  position="absolute"
                  right="8px"
                  bottom="8px"
                  fontSize="sm"
                  color="gray.500"
                >
                  {titleCharacterCount}/25
                </Text>
              </FormControl>

              <FormControl position="relative">
                <Textarea
                  placeholder="Enter A Note"
                  mb="2"
                  value={newNote}
                  onChange={handleBookmarkNoteChange}
                />
                <Text
                  position="absolute"
                  right="8px"
                  bottom="8px"
                  fontSize="sm"
                  color="gray.500"
                >
                  {noteCharacterCount}/250
                </Text>
              </FormControl>

              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text mr="2" fontSize="sm">
                  Timestamp: {convertTime(selectedTimestamp)}
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<Icon as={CiBookmark} />}
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
              variant="gradient"
            >
              Add Bookmark
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookmarkComponent;
