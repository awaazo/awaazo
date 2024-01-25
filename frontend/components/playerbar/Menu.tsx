// PlaylistMenu.tsx
import React, { useState, useEffect } from "react";
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
import { BsFillSkipForwardFill } from "react-icons/bs";
import {
  MdIosShare,
  MdOutlinePlaylistAdd,
  MdOutlinePodcasts,
} from "react-icons/md";

import Link from "next/link";

import { usePlayer } from "../../utilities/PlayerContext";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { PlaylistEditRequest } from "../../utilities/Requests";
import { useRouter } from "next/router";
import { CgPlayList, CgPlayListSearch } from "react-icons/cg";
import { FaDeleteLeft } from "react-icons/fa6";
import ShareComponent from "../social/shareComponent";
import { CiMenuKebab } from "react-icons/ci";

const PlayerMenu = ({ episode }) => {
  const { dispatch } = usePlayer();

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const onShareModalClose = () => setIsShareModalOpen(false);
  const onShareModalOpen = () => setIsShareModalOpen(true);

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleRemoveFromQueue = () => {
    dispatch({ type: "REMOVE_FROM_QUEUE", payload: episode });
  };

  return (
    <Box style={{ position: "relative", zIndex: 9999 }} data-cy={`3-dots`}>
      <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<CiMenuKebab />}
          variant="ghost"
          fontSize="20px"
          ml={1}
          _hover={{ boxShadow: "lg" }}
          onClick={handleMenuToggle}
        />
        <MenuList
          style={{
            backgroundColor: "rgba(50, 50, 50, 0.8)",
            backdropFilter: "blur(4px)",
          }}
        >
          <MenuItem
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            Add to Playlist
            <MdOutlinePlaylistAdd
              size="20px"
              style={{ marginLeft: "auto", color: "white" }}
            />
          </MenuItem>
          <MenuDivider />
          <MenuItem
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
          >
            View Queue
            <CgPlayListSearch
              size="18px"
              style={{ marginLeft: "auto", color: "white" }}
            />
          </MenuItem>
          <MenuItem
            _hover={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontWeight: "bold",
            }}
            style={{
              backgroundColor: "transparent",
            }}
            onClick={handleRemoveFromQueue}
          >
            Remove from Queue
            <FaDeleteLeft
              size="18px"
              style={{ marginLeft: "auto", color: "white" }}
            />
          </MenuItem>
          <Link
            href={"Explore/" + episode?.podcastId}
            style={{ textDecoration: "none" }}
          >
            <MenuItem
              _hover={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                fontWeight: "bold",
              }}
              style={{
                backgroundColor: "transparent",
              }}
            >
              Go to Podcast Page
              <MdOutlinePodcasts
                size="18px"
                style={{ marginLeft: "auto", color: "white" }}
              />
            </MenuItem>
          </Link>

          <MenuDivider />
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
            Share{" "}
            <MdIosShare
              size="20px"
              style={{ marginLeft: "auto", color: "white" }}
            />
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
    </Box>
  );
};

export default PlayerMenu;
