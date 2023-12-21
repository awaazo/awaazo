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

  // Fetch episode details and transform bookmarks
  // useEffect(() => {
  //     const fetchEpisodeDetails = async () => {
  //       const response = await PodcastHelper.getEpisodeById(
  //         episodeId,
  //       );
  //       if (response.status === 200) {
  //         if (response.episode) {
  //           // Transform the bookmarks to match our format
  //           const transformedBookmarks = response.episode.bookmarks.map(
  //             (bookmark) => ({
  //               id: bookmark.id,
  //               title: bookmark.title,
  //               note: bookmark.note,
  //               timestamp: bookmark.timestamp,
  //             }),
  //           );
  //           setBookmarks(transformedBookmarks);
  //         }
  //       } else {
  //         console.error("Error fetching episode details:", response.message);
  //       }
  //     };
  //     fetchEpisodeDetails();
  // }, [episodeId]);



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

  // Function to handle the bookmark/remove bookmark action
 // const handleBookmark = () => {
    // // Toggle the bookmark status based on whether the selected timestamp of the episode is currently bookmarked
    // if (isBookmarked) {
    //   // Call unlikeBookmak because the episode selected timestamp is currently bookmarked
    //   SocialHelper.deleteEpisodeBookmark(episodeId, selectedTimestamp) // This method needs to be implemented in SocialHelper
    //     .then((response) => {
    //       if (response.status === 200) {
    //         // Update the UI to reflect the unlike
    //         setBookmarks(bookmarks, selectedTimestamp)
    //         setIsBookmarked(false);
    //       } else {
    //         console.error(
    //           "Error removing bookmark for the selected timestamp",
    //           response.message,
    //         );
    //       }
    //     });
    // } else {
    //   // Call likeEpisode or likeComment because the episode or comment is currently not liked
    //   SocialHelper.postBookmark(episodeId, selectedTimestamp) // This method needs to be implemented in SocialHelper
    //     .then((response) => {
    //       if (response.status === 200) {
    //         // Update the UI to reflect the like
    //         setBookmarks(bookmarks, selectedTimestamp);
    //         setIsBookmarked(true);
    //       } else {
    //         console.error("Error bokmarking episode selected timestamp", response.message);
    //       }
    //     });
    // }
  //};

  return (
    // // bookmarks.map((bookmark,currentTime) => (
    // //   <></>
    // // ))
    // <>
    
    //   {/* Tooltip to display the like/unlike action */}
    //   {/* <Tooltip label={isBookmarked ? "Bookmark" : "Remove Bookmark"} aria-label="Bookmark tooltip"> */}
    //     {/* Button to trigger the like/unlike action */}
    //     <Button
    //       variant={"ghost"}
    //       p={2}
    //       leftIcon={
    //         <Icon as={CiBookmarkPlus} color="gray.500" />
    //         //note:
    //         //bookmarks.map(bookmark, currentTime)
    //         //if bookmark.selectedTimestamp == currentTime then make the icon white, else make it grey
    //       }
    //       onClick={() => handleBookmark()}
    //     >
    //     </Button>
    //   {/* </Tooltip> */}
    // </>

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
