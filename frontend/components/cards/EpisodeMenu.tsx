import React, { useEffect, useRef, useState } from "react";
import { IconButton, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useToast, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { IoIosMore } from "react-icons/io";
import { MdDelete, MdIosShare, MdOutlinePlaylistAdd } from "react-icons/md";
import { BsPlayFill, BsFillSkipForwardFill } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import ShareComponent from "../social/Share";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";
import { usePlayer } from "../../utilities/PlayerContext";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import AuthHelper from "../../helpers/AuthHelper";
import LoginPrompt from "../auth/AuthPrompt";

const EpisodeMenu = ({ episode, inPlaylist, playlistId }) => {
  const { dispatch } = usePlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const onShareModalClose = () => setIsShareModalOpen(false);
  const onShareModalOpen = () => setIsShareModalOpen(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Add to Playlist implementation
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

  // Handlers to open/close the modal:
  const handleAddToPlaylistMenuToggle = () => {
    setIsAddToPlaylistModalOpen(!isAddToPlaylistModalOpen);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close menu if clicked outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const handleAddPlaylistClick = () => {
    // Check login status before opening the modal
    AuthHelper.authMeRequest().then((response) => {
      if (response.status === 401) {
        console.log("User not logged in");
        // Handle not logged in state (e.g., show a login prompt)
        setIsAddToPlaylistModalOpen(false);
        setShowLoginPrompt(true);
        return;
      }
    });
  };

  useEffect(() => {
    // Add when mounted
    document.addEventListener("mousedown", handleClickOutside);
    // Return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle click on episode
  const handleEpisodeClick = () => {
    dispatch({
      type: "PLAY_NOW_QUEUE",
      payload: episode,
    });
  };

  // Handle click play next on episode
  const handleEpisodeNextClick = () => {
    dispatch({
      type: "ADD_NEXT_QUEUE",
      payload: episode,
    });
  };

  // Handle click play later on episode
  const handleEpisodeLaterClick = () => {
    dispatch({
      type: "ADD_LATER_QUEUE",
      payload: episode,
    });
  };

  // Handle menu item click and show toast notification
  const handleMenuItemClick = (action) => {
    if (action === "playNext") {
      handleEpisodeNextClick();
      toast({
        title: "Episode added to queue",
        status: "info",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    } else if (action === "playLater") {
      handleEpisodeLaterClick();
      toast({
        title: "Episode added to queue",
        status: "info",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // handles Remove from Playlist
  const handleRemovePlaylistMenuToggle = async () => {
    const request = [episode.id];
    const response = await PlaylistHelper.playlistRemoveEpisodeRequest(request, playlistId);
    console.log(response);
    if (response.status == 200) {
      window.location.reload();
    } else {
      console.log("Playlist cannot be deleted");
    }
  };

  return (
    <div ref={menuRef}>
      <Menu isOpen={isMenuOpen}>
        <MenuButton as={IconButton} aria-label="Options" icon={<IoIosMore />} variant="ghost" fontSize="20px" ml={1} mt={1} _hover={{ boxShadow: "lg" }} onClick={handleMenuToggle} data-cy="2-dots-episode-card" />
        <MenuList
          style={{
            backgroundColor: "rgba(50, 50, 50, 0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          <MenuItem
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              fontWeight: "bold",
            }}
            style={{ backgroundColor: "transparent" }}
            onClick={() => {
              handleAddPlaylistClick();
              handleAddToPlaylistMenuToggle();
            }}
          >
            Add to Playlist <MdOutlinePlaylistAdd size={24} style={{ marginLeft: "auto", color: "white" }} onClick={handleAddPlaylistClick} />
          </MenuItem>
          {inPlaylist && (
            <MenuItem
              _hover={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                fontWeight: "bold",
              }}
              style={{ backgroundColor: "transparent", color: "red" }}
              onClick={() => handleRemovePlaylistMenuToggle()}
            >
              Remove from Playlist <MdDelete size={24} style={{ marginLeft: "auto", color: "red" }} />
            </MenuItem>
          )}
          <MenuDivider />
          <MenuItem
            onClick={() => handleEpisodeClick()}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Play "{episode.episodeName}" <BsPlayFill size="20px" style={{ marginLeft: "auto", color: "white" }} />
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
          <MenuDivider />
          <MenuItem
            onClick={onShareModalOpen}
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            backgroundColor="transparent"
          >
            Share <MdIosShare size="20px" style={{ marginLeft: "auto", color: "white" }} />
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShareComponent content={episode} contentType="episode" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} episode={episode} />
      {/* LoginPrompt */}
      {showLoginPrompt && <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="To add this episode to your playlist, you must be logged in. Please log in or create an account." />}
    </div>
  );
};

export default EpisodeMenu;
