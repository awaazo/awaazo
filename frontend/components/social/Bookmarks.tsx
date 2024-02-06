import { useState, FormEvent } from "react";
import { Button, Icon, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, Textarea, VStack, Text, Input, useBreakpointValue } from "@chakra-ui/react";
import { MdBookmark, MdBookmarkAdd } from "react-icons/md";
import BookmarksHelper from "../../helpers/BookmarksHelper";
import { convertTime } from "../../utilities/CommonUtils";
import { EpisodeBookmarkRequest } from "../../types/Requests";

import AuthHelper from "../../helpers/AuthHelper";
import LoginPrompt from "../shared/LoginPrompt";



const Bookmarks = ({ episodeId, selectedTimestamp }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", note: "" });
  const [characterCounts, setCharacterCounts] = useState({ title: 0, note: 0 });
  const [bookmarkError, setBookmarkError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const MAX_TITLE_CHARS = 25;
  const MAX_NOTE_CHARS = 250;
  
  const checkAuthentication = async () => {
    try {
      const response = await AuthHelper.authMeRequest();
      if (response.status === 401) {
        //User is not logged in, prompt them to log in or signup
        setShowLoginPrompt(true);
        setIsLoggedIn(false);
        return;
      }
      setModalOpen(true); // Open the modal only when the user is logged in
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };
    
  const handleChange = (field, maxChars) => (e) => {
    const value = e.target.value.slice(0, maxChars);
    setFormData({ ...formData, [field]: value });
    setCharacterCounts({ ...characterCounts, [field]: value.length });
  };

  const handleBookmark = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.note) {
      setBookmarkError("Bookmark Title and Note are Both Required");
      return;
    }

    const request: EpisodeBookmarkRequest = {
      title: formData.title,
      note: formData.note,
      time: selectedTimestamp,
    };

    try {
      const response = await BookmarksHelper.postBookmark(episodeId, request);
      if (response.status === 200) {
        setModalOpen(false);
        setFormData({ title: "", note: "" });
        console.log("Bookmarked Episode");
      } else {
        console.error("Error bookmarking episode:", response.message);
      }
    } catch (error) {
      console.error("Error bookmarking episode:", error);
    }
  };

  return (
    <>
      <Tooltip label="Bookmark" aria-label="Bookmark tooltip">
        <Button
          padding={"0px"}
          m={1}
          variant={"ghost"}
          onClick={() => {
            checkAuthentication();
            setModalOpen(true);
          }}
        >
          <Icon as={MdBookmark} boxSize={"20px"} />
        </Button>
      </Tooltip>

      {isLoggedIn && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} size="sm">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bookmark</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {bookmarkError && <Text color="red.500">{bookmarkError}</Text>}
              <VStack spacing={5} align="center" p={5}>
                <FormControl>
                  <Input
                    placeholder="Enter A Title"
                    rounded="xl"
                    value={formData.title}
                    onChange={handleChange("title", MAX_TITLE_CHARS)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    {characterCounts.title}/{MAX_TITLE_CHARS}
                  </Text>
                </FormControl>
                <FormControl>
                  <Textarea
                    placeholder="Enter A Note"
                    value={formData.note}
                    onChange={handleChange("note", MAX_NOTE_CHARS)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    {characterCounts.note}/{MAX_NOTE_CHARS}
                  </Text>
                </FormControl>
                <Text fontSize="sm">Timestamp: {convertTime(selectedTimestamp)}</Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button leftIcon={<Icon as={MdBookmarkAdd} />} onClick={handleBookmark} variant="gradient">
                Add Bookmark
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="To add a Bookmark, you must be logged in. Please log in or create an account."
      />
      )}
    </>
  );
};

export default Bookmarks;