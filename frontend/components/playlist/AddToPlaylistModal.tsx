import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, VStack, Button, Text, Select } from "@chakra-ui/react";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Playlist } from "../../types/Interfaces";
import CreatePlaylistModal from "./CreatePlaylistModal";

const AddToPlaylistModal = ({ isOpen, onClose, episode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const onCreateModalClose = () => setIsCreateModalOpen(false);
  const onCreateModalOpen = () => setIsCreateModalOpen(true);

  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  };

  const [targetPlaylistId, setTargetPlaylistId] = useState("");

  // Form errors
  const [playlistError, setPlaylistError] = useState("");

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(page, pageSize).then((res2) => {
      if (res2.status == 200) {
        setPlaylists(res2.playlists);
      } else {
        setPlaylistError("Podcasts cannot be fetched");
      }
    });
  }, [page, reload]);

  const userPlaylists = playlists.filter((playlist) => playlist.isHandledByUser);

  const handleAddToExistingPlaylist = async () => {
    // Ensure all required fields are filled
    if (targetPlaylistId == "" || targetPlaylistId == null) {
      setPlaylistError("Please Choose a Playlist");
      return;
    }
    // Create request object
    const request = [episode.id];

    // Send the request
    const response = await PlaylistHelper.playlistAddEpisodeRequest(request, targetPlaylistId);

    if (response.status === 200) {
      onClose();
    } else {
      console.log(response.data);
      console.log(response.message);
      setPlaylistError(response.data);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add <Text as="span" fontWeight="bold" color="az.red">{episode?.episodeName}</Text> to a Playlist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Button variant={'large'} bgColor={"az.blue"} color={"white"} onClick={onCreateModalOpen}>
              Create New Playlist
            </Button>

            <Text fontSize={"md"} fontWeight={"bold"}>OR</Text>
            {playlistError && <Text color="red.500">{playlistError}</Text>}
            <Select placeholder="Select an Existing Playlist" onChange={(e) => setTargetPlaylistId(e.target.value)}>
              {userPlaylists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </Select>
            <Button variant={'large'} mr={3} onClick={() => handleAddToExistingPlaylist()}>
            Add to Playlist
          </Button>
          </VStack>
        </ModalBody>

      </ModalContent>
      <CreatePlaylistModal onClose={onCreateModalClose} isOpen={isCreateModalOpen} handleReload={handleReload} />
    </Modal>
  );
};

export default AddToPlaylistModal;
