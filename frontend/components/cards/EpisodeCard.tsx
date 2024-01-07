import React, { useState } from "react";
import { Box, Flex, IconButton, useBreakpointValue, Text, Image, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useToast } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { BsExplicitFill, BsFillSkipForwardFill, BsPlayFill } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { CgPlayList, CgPlayListAdd } from "react-icons/cg";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MdDelete, MdIosShare } from "react-icons/md";
import { usePlayer } from "../../utilities/PlayerContext";
import LikeComponent from "../social/likeComponent";
import CommentComponent from "../social/commentComponent";
import AddToPlaylistModal from "../playlist/AddToPlaylistModal";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { convertTime } from "../../utilities/commonUtils";

// Component to display an episode
const EpisodeCard = ({ episode, inPlaylist, playlistId }) => {
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

  const isMobile = useBreakpointValue({ base: true, md: false });

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

  // Add to Playlist implementation
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

  // Handlers to open/close the modal:
  const handleAddToPlaylistMenuToggle = () => {
    setIsAddToPlaylistModalOpen(!isAddToPlaylistModalOpen);
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
    <Flex
      paddingTop={3}
      paddingBottom={3}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={"rgba(0, 0, 0, 0.2)"}
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
        <Image boxSize={isMobile ? "0px" : "125px"} src={episode.thumbnailUrl} borderRadius="10%" marginLeft={isMobile ? "0px" : "20px"} mt={1} />
        {!isMobile && <IconButton aria-label="Play" icon={<FaPlay />} position="absolute" left="60%" top="50%" transform="translate(-50%, -50%)" variant="ghost" fontSize="25px" shadow={"md"} _hover={{ boxShadow: "lg" }} />}
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && <Icon as={BsExplicitFill} boxSize={isMobile ? "10px" : "16px"} ml={4} />}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex direction="column" fontSize="sm" color={"gray.500"}>
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {convertTime(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start" style={{ marginRight: "15px" }}>
        <CommentComponent episodeIdOrCommentId={episode.id} initialComments={episode.comments.length} />
        <Box marginTop="4px" marginLeft="4px" data-cy={`likes-on-${episode.episodeName}-${episode.likes}`}>
          <LikeComponent episodeOrCommentId={episode.id} initialLikes={episode.likes} />
        </Box>
        {/* Episode Options Menu */}
        <Box style={{ position: "relative", zIndex: 1000 }}>
          <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
            <MenuButton as={IconButton} aria-label="Options" icon={<IoIosMore />} variant="ghost" fontSize="20px" ml={1} mt={1} _hover={{ boxShadow: "lg" }} onClick={handleMenuToggle} data-cy={`2-dots-episode-card`} />
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
                onClick={handleAddToPlaylistMenuToggle}
              >
                Add to Playlist <CgPlayList size={24} style={{ marginLeft: "auto", color: "white" }} />
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
        </Box>
      </Flex>
      <AddToPlaylistModal isOpen={isAddToPlaylistModalOpen} onClose={() => setIsAddToPlaylistModalOpen(false)} episode={episode} />
    </Flex>
  );
};

export default EpisodeCard;
