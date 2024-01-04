import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Divider,
  Text,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Image,
  Center,
  Switch,
  FormControl,
  Textarea,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaHeart, FaPlus } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import PlaylistHelper from "../../helpers/PlaylistHelper";
import { Episode, Playlist } from "../../utilities/Interfaces";
import { PlaylistCreateRequest } from "../../utilities/Requests";
import { PiQueueFill } from "react-icons/pi";
import { usePlayer } from "../../utilities/PlayerContext";

const PlaylistSidebar = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [reload, setReload] = useState(false);
  const [playlistError, setPlaylistError] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistNameCharacterCount, setPlaylistNameCharacterCount] = useState<number>(0);
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistDescriptionCharacterCount, setPlaylistDescriptionCharacterCount] = useState<number>(0);
  const [isPrivate, setIsPrivate] = useState(false);

  // Queue values
  const { state } = usePlayer();
  const { dispatch } = usePlayer();
  const [isQueueModalOpen, setQueueModalOpen] = useState(false);
  const [queueEpisodes, setQueueEpisodes] = useState<Episode[]>(state.playlist);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<Number>(state.currentEpisodeIndex);
  const [imageUrls, setImageUrls] = useState({});
  // Initialize random images for playlists (remove later when we get the endpoint
  useEffect(() => {
    const newImageUrls = {};
    playlists.forEach((playlist) => {
      newImageUrls[playlist.id] = `https://source.unsplash.com/random/100x100?sig=${playlist.id}`;
    });
    setImageUrls(newImageUrls);
  }, [playlists]);
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
  const nonUserPlaylists = playlists.filter((playlist) => !playlist.isHandledByUser);

  // State for the modal
  const [isModalOpen, setModalOpen] = React.useState(false);

  // Handle logic for adding a playlist
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
      // Success, refresh sidebar
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPrivate(false);
      setReload(!reload);
      setModalOpen(false);
    } else {
      console.log(response.data);
      // Handle error here
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

  const handleViewQueue = () => {
    setQueueEpisodes(state.playlist);
    setCurrentEpisodeIndex(state.currentEpisodeIndex);
    setQueueModalOpen(true);
  };

  const handleQueueSelect = (index: Number) => {
    dispatch({
      type: "SET_CURRENT_INDEX",
      payload: index,
    });
  };

  return (
    <Box w="100%" maxW="400px" h="auto" mt="2" borderRadius="20px" overflowY="auto">
      {/* All Non-User Handled Playlists */}
      {/* <Flex direction="column" mb="4">
        {nonUserPlaylists.map((playlist) => (
          <Link href={`/Playlist/${playlist.id}`} key={playlist.id}>
            <HStack spacing={4} padding={2} borderRadius={"5px"} _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}>
              <Icon as={FaHeart} boxSize={4} />
              <Text fontSize="md">{playlist.name}</Text>
            </HStack>
          </Link>
        ))}
      </Flex> */}

      {/* User Handled Playlists */}
      <Flex direction="column" mb="4">
        <Flex direction="row" justify="space-between" align="center" mb={2}>
          <Text fontWeight="bold" fontSize={"18px"}>
            My Shelve
          </Text>

          <IconButton icon={<FaPlus />} variant={"ghost"} aria-label="Add Playlist" fontSize={"20px"} onClick={() => setModalOpen(true)} data-cy={`add-playlist-button`} />
        </Flex>
        {userPlaylists && userPlaylists.length === 0 ? (
          <Text textAlign={"center"} mt={5} fontWeight={"bold"}>
            You have no playlists
          </Text>
        ) : (
          userPlaylists &&
          userPlaylists.map((playlist) => (
            <Link href={`/Playlist/${playlist.id}`} key={playlist.id}>
              <Flex align="center" padding={1} pl={2} borderRadius={"5px"} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                <Image src={imageUrls[playlist.id] || "https://via.placeholder.com/100"} alt="Playlist" boxSize="12" mr="2" borderRadius="8" />

                <Text data-cy={`playlist-${playlist.name}`}>{playlist.name}</Text>
              </Flex>
            </Link>
          ))
        )}
        <Divider mt="4" mb="4" />
        <Flex align="center" padding={1} pl={2} borderRadius={"5px"} _hover={{ bg: "rgba(255, 255, 255, 0.3)", cursor: "pointer" }} onClick={() => handleViewQueue()}>
          <Icon as={PiQueueFill} mr="2" />
          <Text data-cy={`queue-button`}>View Queue</Text>
        </Flex>
      </Flex>

      {/* Modal for Adding Playlist */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Input fields for playlist information */}
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
              {/* Toggle for privacy */}
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
      <Modal isOpen={isQueueModalOpen} onClose={() => setQueueModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Queue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {queueEpisodes && queueEpisodes.length > 0 ? (
              queueEpisodes.map((episode, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  mb={2}
                  bg={index === state.currentEpisodeIndex ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.3)"}
                  p={3}
                  borderRadius={"50px"}
                  onClick={() => handleQueueSelect(index)}
                  _hover={{ cursor: "pointer" }}
                >
                  <Box w="40px" h="40px" borderRadius="50%" overflow="hidden" marginRight="10px">
                    <Image as="img" src={episode.thumbnailUrl} alt={episode.episodeName} w="100%" h="100%" />
                  </Box>
                  <Text fontWeight={state.currentEpisodeIndex === index ? "bold" : "normal"}>{state.currentEpisodeIndex === index ? `${episode.episodeName} - Now Playing` : episode.episodeName}</Text>
                </Flex>
              ))
            ) : (
              <Text textAlign="center" mt={5} fontWeight="bold">
                You have no episodes in your queue.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlaylistSidebar;
