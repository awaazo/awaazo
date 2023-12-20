import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Tag,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  Text,
  Image,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  useToast,
  Select,
} from "@chakra-ui/react";

import { FaPlay } from "react-icons/fa";
import {
  BsExplicitFill,
  BsFillSkipForwardFill,
  BsPlayFill,
} from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { CgPlayList, CgPlayListAdd } from "react-icons/cg";
import { GrCaretNext } from "react-icons/gr";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdIosShare } from "react-icons/md";
import { usePlayer } from "../../utilities/PlayerContext";
import LikeComponent from "../social/likeComponent";
import CommentComponent from "../social/commentComponent";

// Component to display an episode
const EpisodeCard = ({ episode }) => {
  const { dispatch } = usePlayer();
  const toast = useToast();

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

  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Format duration in minutes and seconds
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle menu open and close
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
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

  const [isAddToPlaylistMenuOpen, setIsAddToPlaylistMenuOpen] = useState(false);

  const handleAddToPlaylistMenuToggle = () => {
    setIsAddToPlaylistMenuOpen(!isAddToPlaylistMenuOpen);
  };

  const handleAddToPlaylistItemClick = (action) => {
    // Implement logic based on the selected action
    if (action === "createPlaylist") {
      // Add logic for creating a new playlist
    } else if (action === "selectPlaylist") {
      // Add logic for selecting an existing playlist
    }
    // Close the menu after handling the action
    setIsAddToPlaylistMenuOpen(false);
  };

  return (
    <Flex
      className="hoverEffect"
      paddingTop={5}
      paddingBottom={5}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      style={{ cursor: "pointer", transition: "transform 0.3s" }}
      onMouseOver={(e) => {
        // Check if the menu is open before applying the transform
        if (!isMenuOpen) {
          e.currentTarget.style.transform = "scale(1.05)";
        }
      }}
      onMouseOut={(e) => {
        // Check if the menu is open before applying the transform
        if (!isMenuOpen) {
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
      onDoubleClick={handleEpisodeClick}
    >
      <Box position="relative" mr={5} onClick={() => handleEpisodeClick()}>
        <Image
          boxSize={isMobile ? "0px" : "110px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          marginLeft={isMobile ? "0px" : "20px"}
          mt={1}
        />
        {!isMobile && (
          <IconButton
            aria-label="Play"
            icon={<FaPlay />}
            position="absolute"
            left="60%"
            top="50%"
            transform="translate(-50%, -50%)"
            variant="ghost"
            fontSize="25px"
            shadow={"md"}
            _hover={{ boxShadow: "lg" }}
          />
        )}
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Icon
              as={BsExplicitFill}
              boxSize={isMobile ? "10px" : "16px"}
              ml={4}
            />
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {formatDuration(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start" style={{ marginRight: "15px" }}>
        <CommentComponent
          episodeIdOrCommentId={episode.id}
          initialComments={episode.comments.length}
        />
        <div style={{ marginTop: "4px", marginLeft: "4px" }}>
          <LikeComponent
            episodeOrCommentId={episode.id}
            initialLikes={episode.likes}
          />
        </div>
        {/* Episode Options Menu */}
        <Box style={{ position: "relative", zIndex: 1000 }}>
          <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<IoIosMore />}
              variant="ghost"
              fontSize="20px"
              ml={1}
              mt={1}
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
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  fontWeight: "bold",
                }}
                style={{ backgroundColor: "transparent" }}
              >
                Add to Playlist{" "}
                <CgPlayList
                  size={24}
                  style={{ marginLeft: "auto", color: "white" }}
                />
              </MenuItem>
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
                Play "{episode.episodeName}"{" "}
                <BsPlayFill
                  size="20px"
                  style={{ marginLeft: "auto", color: "white" }}
                />
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
                Play Next{" "}
                <TbPlayerTrackNextFilled
                  size="18px"
                  style={{ marginLeft: "auto", color: "white" }}
                />
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
                Play Later{" "}
                <BsFillSkipForwardFill
                  size="18px"
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
                Share{" "}
                <MdIosShare
                  size="20px"
                  style={{ marginLeft: "auto", color: "white" }}
                />
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Flex>
  );
};

export default EpisodeCard;
