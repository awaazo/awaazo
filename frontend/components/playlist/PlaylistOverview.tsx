import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Episode, Playlist } from "../../utilities/Interfaces";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import EpisodeCard from "../cards/EpisodeCard";
import PlaylistCard from "../cards/PlaylistCard";
import { RiPlayList2Fill } from "react-icons/ri";
import { convertTime } from "../../utilities/commonUtils";
import { ImShuffle } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { BsPlayFill, BsFillSkipForwardFill } from "react-icons/bs";
import { CgPlayList } from "react-icons/cg";
import { IoIosMore } from "react-icons/io";
import { MdDelete, MdIosShare } from "react-icons/md";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { usePlayer } from "../../utilities/PlayerContext";
import { FiEdit } from "react-icons/fi";
import PodcastHelper from "../../helpers/PodcastHelper";
import { PlaylistEditRequest } from "../../utilities/Requests";
import ShareComponent from "../social/shareComponent";

const PlaylistOverview = ({ episode, playlistId }) => {
  const { dispatch } = usePlayer();
  const toast = useToast();

  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const onShareModalClose = () => setIsShareModalOpen(false);
  const onShareModalOpen = () => setIsShareModalOpen(true);
  // Form values
  const [playlistName, setPlaylistName] = useState("");
  const [playlistNameCharacterCount, setPlaylistNameCharacterCount] =
    useState<number>(0);
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [
    playlistDescriptionCharacterCount,
    setPlaylistDescriptionCharacterCount,
  ] = useState<number>(0);
  const [isPrivate, setIsPrivate] = useState(false);

  const [reload, setReload] = useState(false);

  // Form errors
  const [playlistError, setPlaylistError] = useState("");

  const handleSharePlaylist = () => {
    onShareModalOpen();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PlaylistHelper.playlistsEpisodesGet(playlistId);
        setPlaylist(response.playlist);
        setEpisodes(response.playlist.playlistEpisodes);
      } catch (error) {
        setPlaylistError("Cannot load Playlist");
      }
    };

    fetchData();
  }, [playlistId, reload]);

  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
      setPlaylistDescription(playlist.description);
      setIsPrivate(playlist.privacy === "Private");
    }
  }, [playlist]);

  useEffect(() => {
    if (playlistName && playlistDescription) {
      setPlaylistNameCharacterCount(playlistName.length);
      setPlaylistDescriptionCharacterCount(playlistDescription.length);
    }
  }, [playlistName, playlistDescription]);

  // Handle click on playlist
  const handlePlaylistClick = () => {
    dispatch({
      type: "PLAY_PLAYLIST_NOW",
      payload: playlist,
    });
  };

  // Handle click play next on playlist
  const handlePlayNextClick = () => {
    dispatch({
      type: "ADD_PLAYLIST_NEXT",
      payload: playlist,
    });
  };

  // Handle click play later on playlist
  const handlePlaylistLaterClick = () => {
    dispatch({
      type: "ADD_PLAYLIST_LATER",
      payload: playlist,
    });
  };

  // Handle shffule on playlist
  const handlePlaylistShuffleClick = () => {
    dispatch({
      type: "SHUFFLE_PLAYLIST_NOW",
      payload: playlist,
    });
  };

  // Handle menu item click and show toast notification
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

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Function to handle deletion of the episode
  const handleDelete = async (playlistId) => {
    setDeleting(true);
    const response = await PlaylistHelper.playlistDeleteRequest(playlistId);
    console.log(response);
    if (response.status == 200) {
      window.location.href = "/Playlist/MyPlaylists";
    } else {
      setPlaylistError("Playlist cannot be deleted");
    }
    onClose();
    setDeleting(false);
  };

  // Ensures playlist name is not longer than 25 characters
  const handlePlaylistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setPlaylistName(newName);
    setPlaylistNameCharacterCount(newName.length);
  };

  // Ensures playlist description is not longer than 250 characters
  const handlePlaylistDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDesc = e.target.value.slice(0, 250);
    setPlaylistDescription(newDesc);
    setPlaylistDescriptionCharacterCount(newDesc.length);
  };

  const [isEditing, setIsEditing] = useState(false);

  // Handle logic for editing a playlist
  const handleEditPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are filled
    if (playlistName == "" || playlistDescription == "") {
      setPlaylistError("Playlist Name and Description");
      return;
    }
    // Create request object
    const request: PlaylistEditRequest = {
      name: playlistName,
      description: playlistDescription,
      privacy: isPrivate ? "Private" : "Public",
    };

    // Send the request
    const response = await PlaylistHelper.playlistEditRequest(
      request,
      playlist.id,
    );

    if (response.status === 200) {
      // Success, refresh sidebar
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPrivate(false);
      setReload(!reload);
      setIsEditing(false);
    } else {
      console.log(response.data);
      setPlaylistError(response.data);
    }
  };

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle menu open and close
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const OptionsMenu = () => {
    return (
      <>
        {" "}
        <MenuDivider />
        <MenuItem
          _hover={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            fontWeight: "bold",
          }}
          style={{ backgroundColor: "transparent" }}
          onClick={() => {
            setIsEditing(true);
            handleMenuToggle();
          }}
          
        >
          Edit "{playlist.name}"{" "}
          <FiEdit size={20} style={{ marginLeft: "auto", color: "white" }} data-cy={`edit-button`} />
        </MenuItem>
        <MenuItem
          _hover={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            fontWeight: "bold",
          }}
          style={{
            backgroundColor: "transparent",
            color: "red",
          }}
          onClick={onOpen}
        >
          Delete "{playlist.name}"{" "}
          <MdDelete size={20} style={{ marginLeft: "auto", color: "red" }} data-cy={`delete-button`}/>
        </MenuItem>
      </>
    );
  };

  return (
    <VStack spacing="4" align="stretch">
      {playlist && (
        <>
          <Flex justifyContent="space-between" align="center">
            {/* Playlist Name */}
            <Flex alignItems="center">
              <RiPlayList2Fill size={"30px"} />
              <Text fontWeight="medium" fontSize="30px" ml={2}>
                {isEditing ? (
                  <>
                    <FormControl position="relative">
                      <Input
                        placeholder="Enter Playlist Name"
                        rounded="lg"
                        pr="50px"
                        value={playlistName}
                        onChange={handlePlaylistNameChange}
                      />
                      <Text
                        position="absolute"
                        right="8px"
                        bottom="8px"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {playlistNameCharacterCount}/25
                      </Text>
                    </FormControl>
                  </>
                ) : (
                  playlist.name
                )}
              </Text>
            </Flex>
            <Text fontWeight="medium" fontSize="md">
              {isEditing ? (
                <>
                  <Text mr="2" fontSize="sm">
                    Private:
                  </Text>
                  <Switch
                    isChecked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                    colorScheme="purple"
                  />
                </>
              ) : (
                playlist.privacy
              )}
            </Text>
          </Flex>
          <Box fontSize="sm" color="white">
            <Text fontWeight="small" fontSize="lg" mb={2}>
              {isEditing ? (
                <>
                  <FormControl position="relative">
                    <Textarea
                      rounded="lg"
                      value={playlistDescription}
                      onChange={handlePlaylistDescriptionChange}
                    />
                    <Text
                      position="absolute"
                      right="8px"
                      bottom="8px"
                      fontSize="sm"
                      color="gray.500"
                    >
                      {playlistDescriptionCharacterCount}/250
                    </Text>
                  </FormControl>
                </>
              ) : (
                playlist.description
              )}
            </Text>
            {isEditing ? (
              <Box justifyContent={"flex-end"} textAlign={"right"} mt={5}>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setReload(!reload);
                  }}
                  mr={3}
                >
                  Cancel
                </Button>
                <Button onClick={(e) => handleEditPlaylist(e)}>
                  Update Playlist Info
                </Button>
              </Box>
            ) : (
              <>
                <Flex>
                  <Box flex={1}>
                    <Text color="white">
                      <Text>
                        <b>Number of Episodes:</b> {playlist.numberOfEpisodes}
                      </Text>{" "}
                    </Text>
                    <Text color="white">
                      <Text>
                        {" "}
                        <b>Duration:</b> {convertTime(playlist.duration)}
                      </Text>{" "}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500">
                      <Text fontWeight="bold">
                        Created At:{" "}
                        {new Date(playlist.createdAt).toLocaleDateString()}
                      </Text>{" "}
                    </Text>
                    <Text color="gray.500">
                      <Text fontWeight="bold">
                        Updated At:{" "}
                        {new Date(playlist.updatedAt).toLocaleDateString()}
                      </Text>{" "}
                    </Text>
                  </Box>
                </Flex>
                <Flex mt={4}>
                  <Button
                    onClick={() => handlePlaylistClick()}
                    leftIcon={<FaPlay />}
                  >
                    Play
                  </Button>
                  <Button
                    onClick={() => handlePlaylistShuffleClick()}
                    leftIcon={<ImShuffle />}
                    ml={2}
                  >
                    Shuffle
                  </Button>
                  <Spacer />
                  <Box style={{ position: "relative", zIndex: 1000 }} data-cy={`3-dots`}>
                    <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<IoIosMore />}
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
                          onClick={() => handlePlaylistClick()}
                          _hover={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            fontWeight: "bold",
                          }}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        >
                          Play "{playlist.name}"{" "}
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
                        {playlist.isHandledByUser && <OptionsMenu />}{" "}
                        <MenuDivider />
                        <MenuItem
                          onClick={handleSharePlaylist}
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
                  <Modal isOpen={isShareModalOpen} onClose={onShareModalClose}>
                  <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Share this Episode</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <ShareComponent content={playlist} contentType="playlist" />
                      </ModalBody>
                  </ModalContent>
              </Modal>
                </Flex>
              </>
            )}
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" mt={2}>
              Episodes:
            </Text>
            {episodes && episodes.length > 0 ? (
              episodes.map((episode: any) => (
                <EpisodeCard
                  episode={episode}
                  inPlaylist={true}
                  playlistId={playlist.id}
                />
              ))
            ) : (
              <Text textAlign={"center"} mt={"5%"} fontWeight={"bold"}>
                No episodes in this playlist yet
              </Text>
            )}
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete the episode "{playlist.name}".{" "}
                <br />
                This action cannot be undone
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={() => handleDelete(playlist.id)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>{" "}
        </>
      )}
    </VStack>
  );
};

export default PlaylistOverview;
