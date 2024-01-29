// PlaylistMenu.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Menu,
  MenuButton,
  IconButton,
  Input,
  Textarea,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { IoIosMore } from "react-icons/io";
import { BsPlayFill, BsFillSkipForwardFill } from "react-icons/bs";
import { MdIosShare } from "react-icons/md";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { usePlayer } from "../../utilities/PlayerContext";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import ImageAdder from "../tools/ImageAdder";

import { useRouter } from "next/router";
import ShareComponent from "../social/Share";

const PlaylistMenu = ({ playlist, onUpdate }) => {
  const { dispatch } = usePlayer();
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [playlistCoverArt, setPlaylistCoverArt] = useState<File | null>(null);
  const router = useRouter();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const onShareModalOpen = () => setIsShareModalOpen(true);
  const onShareModalClose = () => setIsShareModalOpen(false);

  // Function to handle deletion of the playlist
  const handleDelete = async (id) => {
    setDeleting(true);
    const response = await PlaylistHelper.playlistDeleteRequest(playlist.id);
    if (response.status === 200) {
      window.location.href = "/Playlist/MyPlaylists";
    } else {
      toast({
        title: "Error deleting playlist",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
    setDeleting(false);
  };
  // Handler functions for play actions
  const handlePlayNextClick = () => {
    dispatch({
      type: "ADD_PLAYLIST_NEXT",
      payload: playlist,
    });
  };
  const handlePlaylistLaterClick = () => {
    dispatch({
      type: "ADD_PLAYLIST_LATER",
      payload: playlist,
    });
  };

  const handlePlaylistClick = () => {
    dispatch({
      type: "PLAY_PLAYLIST_NOW",
      payload: playlist,
    });
  };

  const handleMenuItemClick = (action) => {
    if (action === "playNext") {
      handlePlayNextClick();
      toast({
        title: "Playlist added to queue",
        status: "info",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    } else if (action === "playLater") {
      handlePlaylistLaterClick();
      toast({
        title: "Playlist added to queue",
        status: "info",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Open and close edit modal
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  useEffect(() => {
    setName(playlist.name);
    setDescription(playlist.description);
    // setIsPrivate logic here if needed
  }, [playlist]);

  // Handle save logic for editing a playlist
  const handleSaveEdit = async () => {
    if (!playlist.id) {
      toast({
        title: "Playlist ID is missing",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const request = {
      name: name,
      description: description,
      privacy: "false",
      coverArt: playlistCoverArt,
    };

    const response = await PlaylistHelper.playlistEditRequest(request, playlist.id);
    if (response.status === 200) {
      toast({
        position: "top",
        title: "Playlist updated successfully",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      const updatedPlaylist = {
        ...playlist,
        name: name,
        description: description,
        // Include other updated fields if applicable
      };
      // Update the parent component's state
      onUpdate(updatedPlaylist);
    } else {
      toast({
        position: "top",
        title: "Error updating playlist",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
    closeEditModal();
  };

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  // const handleImageAdded = useCallback(async (addedImageUrl: string) => {
  //   try {
  //     const response = await fetch(addedImageUrl);
  //     const blob = await response.blob();
  //     const file = new File([blob], "avatar.jpg", { type: blob.type });
  //     setPlaylistCoverArt(file);
  //   } catch (error) {
  //     console.error("Error converting image URL to File:", error);
  //   }
  // }, []);

  return (
    <Box style={{ position: "relative", zIndex: 1000 }} data-cy={`3-dots`}>
      <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
        <MenuButton as={IconButton} aria-label="Options" icon={<IoIosMore />} variant="ghost" fontSize="20px" ml={1} _hover={{ boxShadow: "lg" }} onClick={handleMenuToggle} />
        <MenuList
          style={{
            backgroundColor: "rgba(50, 50, 50, 0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          <MenuItem
            onClick={() => handlePlaylistClick()}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Play "{playlist.name}" <BsPlayFill size="20px" style={{ marginLeft: "auto", color: "white" }} />
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("playNext")}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Play Next <TbPlayerTrackNextFilled size="18px" style={{ marginLeft: "auto", color: "white" }} />
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("playLater")}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Play Later <BsFillSkipForwardFill size="18px" style={{ marginLeft: "auto", color: "white" }} />
          </MenuItem>

          {playlist.isHandledByUser && (
            <>
              <MenuDivider />
              <MenuItem
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)", fontWeight: "bold" }}
                style={{ backgroundColor: "transparent" }}
                onClick={() => {
                  openEditModal();
                  handleMenuToggle();
                }}
              >
                Edit "{playlist.name}" <FiEdit size={20} style={{ marginLeft: "auto", color: "white" }} data-cy={`edit-button`} />
              </MenuItem>
              <MenuItem _hover={{ backgroundColor: "rgba(255, 255, 255, 0.4)", fontWeight: "bold" }} style={{ backgroundColor: "transparent", color: "red" }} onClick={onOpen}>
                Delete "{playlist.name}" <MdDelete size={20} style={{ marginLeft: "auto", color: "red" }} data-cy={`delete-button`} />
              </MenuItem>
            </>
          )}
          <MenuItem
            onClick={onShareModalOpen}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Share <MdIosShare size="20px" style={{ marginLeft: "auto", color: "white" }} />
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShareComponent content={playlist} contentType="playlist" />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the episode "{playlist.name}". <br />
            This action cannot be undone
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => handleDelete(playlist.id)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={closeEditModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {/* <ImageAdder onImageAdded={handleImageAdded} /> */}
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} focusBorderColor="brand.100" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} focusBorderColor="brand.100" />
            </FormControl>
           
          </ModalBody>
          <ModalFooter>
            <Button bg="black.100" _hover={{ bg: "brand.100" }} mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlaylistMenu;
