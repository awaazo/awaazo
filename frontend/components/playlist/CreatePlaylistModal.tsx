// CreatePlaylist.tsx
import React, { useState, FormEvent } from "react";
import { Box,Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Button, FormControl, Textarea, Text, VStack, Switch } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { PlaylistCreateRequest } from "../../utilities/Requests";

const CreatePlaylistModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [playlistError, setPlaylistError] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [reload, setReload] = useState(false);
  const [playlistNameCharacterCount, setPlaylistNameCharacterCount] = useState<number>(0);
  const [playlistDescriptionCharacterCount, setPlaylistDescriptionCharacterCount] = useState<number>(0);

  const handleAddPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are filled
    if (playlistName == "" || playlistDescription == "") {
      setPlaylistError("Playlist Name and Description are Both Required");
      return;
    }
    // Create request object
    const request: PlaylistCreateRequest = {
      name: playlistName,
      description: playlistDescription,
      privacy: isPrivate ? "Private" : "Public",
      episodeIds: [],
    };

    // Send the request
    const response = await PlaylistHelper.playlistCreateRequest(request);

    if (response.status === 200) {
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPrivate(false);
      setReload(!reload);
      setModalOpen(false);
    } else {
      console.log(response.data);
      setPlaylistError(response.data);
    }
  };

  // Ensures playlist name is not longer than 25 characters
  const handlePlaylistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setPlaylistName(newName);
    setPlaylistNameCharacterCount(newName.length);
  };

  // Ensures playlist description is not longer than 250 characters
  const handlePlaylistDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value.slice(0, 250);
    setPlaylistDescription(newDesc);
    setPlaylistDescriptionCharacterCount(newDesc.length);
  };

  return (
    <>
      <IconButton icon={<FaPlus />} variant={"ghost"} aria-label="Add Playlist" fontSize={"15px"} onClick={() => setModalOpen(true)} data-cy={`add-playlist-button`} />
      
      {/* Modal for Adding Playlist */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Playlist</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {playlistError && <Text color="red.500">{playlistError}</Text>}
            <VStack spacing={5} align="center" p={5}>

              <FormControl position="relative">
                <Input placeholder="Enter Playlist Name" rounded="lg" pr="50px" value={playlistName} onChange={handlePlaylistNameChange} />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                  {playlistNameCharacterCount}/25
                </Text>
              </FormControl>

              <FormControl position="relative">
                <Textarea placeholder="Description" mb="2" value={playlistDescription} onChange={handlePlaylistDescriptionChange} />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                  {playlistDescriptionCharacterCount}/250
                </Text>
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="center">
                <Flex align="center" mb="2">
                  <Text mr="2" fontSize="sm">
                    Private:
                  </Text>
                  <Switch isChecked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} colorScheme="purple" />
                </Flex>
              </FormControl>

            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddPlaylist}>
              Add Playlist
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
   
    </>
  );
};

export default CreatePlaylistModal;
