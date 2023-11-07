import React, { useState, FormEvent } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Wrap,
  WrapItem,
  Textarea,
  MenuGroup,
  Image,
  Tooltip,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  Text,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tag,
  Spacer,
} from "@chakra-ui/react";
import { QuestionOutlineIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

import MyEpisodes from "../myPodcast/MyEpisodes";

const PodcastGenres = [
  "Technology",
  "Comedy",
  "Science",
  "History",
  "News",
  "True Crime",
  "Business",
  "Health",
  "Education",
  "Travel",
  "Music",
  "Arts",
  "Sports",
  "Politics",
  "Fiction",
  "Food",
];

const episodes = [
  {
    id: "1",
    name: "Episode 1: Introduction to React",
    thumbnail:
      "https://fastly.picsum.photos/id/522/200/200.jpg?hmac=-4K81k9CA5C9S2DWiH5kP8rMvaAPk2LByYZHP9ejTjA",
    duration: "30:00",
    releaseDate: "2023-01-15",
    isExplicit: false,
    playCount: 10000,
  },
  {
    id: "2",
    name: "Episode 2: State Management",
    thumbnail:
      "https://fastly.picsum.photos/id/860/200/200.jpg?hmac=xEnSgZhxWVFOWiVCBQzYpKUH7S5nFb7-QTZ8Hfqwq4M",
    duration: "45:20",
    releaseDate: "2023-02-02",
    isExplicit: true,
    playCount: 8500,
  },
  {
    id: "3",
    name: "Episode 3: Advanced Hooks in React",
    thumbnail:
      "https://fastly.picsum.photos/id/369/200/200.jpg?hmac=mfma93Qqk_dWRARrDhIl7oid7sWebuZHhKQFsnMwwwE",
    duration: "40:45",
    releaseDate: "2023-02-20",
    isExplicit: false,
    playCount: 9200,
  },
  {
    id: "4",
    name: "Episode 4: React Performance Optimization",
    thumbnail:
      "https://fastly.picsum.photos/id/417/200/200.jpg?hmac=urRppSmoZMSijmMMM_igfBcmbcTu_y285erBFfY7jE4",
    duration: "55:30",
    releaseDate: "2023-03-10",
    isExplicit: false,
    playCount: 7500,
  },
];

const PodcastManager = ({ name }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isPublic, setIsPublic] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const podcastName = name || "";
  const [newPodcastName, setNewPodcastName] = useState(podcastName);
  const [newDescription, setNewDescription] = useState(
    "A podcast that delves into the wonders of the natural world, from the depths of the ocean to the mysteries of the cosmos.",
  );
  const [newTags, setNewTags] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(
    "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
  );
  const [thumbnailFile, setThumbnailFile] = useState<File>(null);
  const [genreColors, setGenreColors] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

  function getRandomDarkColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)]; // Restrict to the first 8 characters for darker colors
    }
    return color;
  }

  function getRandomGradient() {
    const color1 = getRandomDarkColor();
    const color2 = getRandomDarkColor();
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  }

  const handleTagClick = (genre) => {
    if (selectedTags.includes(genre)) {
      setSelectedTags(selectedTags.filter((item) => item !== genre));
    } else {
      setSelectedTags([...selectedTags, genre]);
      if (!genreColors[genre]) {
        setGenreColors({ ...genreColors, [genre]: getRandomDarkColor() });
      }
    }
  };

  const handleDelete = () => {
    // TO BE IMPLEMENTED
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Updates the thumbnail, name, description, and tags of the podcast
  const updatePodcastInfo = () => {
    console.log();
  };

  // Handles thumbnail upload
  const handleAvatarUpload = (e: FormEvent) => {
    setThumbnailFile((e.target as any).files[0]);
    setThumbnail(URL.createObjectURL((e.target as any).files[0]));
    e.preventDefault();
  };

  return (
    <div>
      {/* Main Content */}
      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
        <Flex
          align="center"
          justify="space-between"
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Text fontSize="30px" fontWeight="bold">
            {podcastName.replace("-", " ")}
            {!isMobile && (
              <Box p={4}>
                <Text fontSize="md" mt={4}>
                  {newDescription}
                </Text>
              </Box>
            )}
          </Text>

          <Flex align="center" justify="flex-end" flex="1">
            <Flex align="center">
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  variant="ghost"
                  size="lg"
                  rounded={"full"}
                  opacity={0.7}
                  color="blue.500"
                  mr={4}
                  onClick={() => handleEdit()}
                />
              </Tooltip>
            </Flex>

            <Flex align="center">
              <Tooltip label="Delete">
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon />}
                  variant="ghost"
                  size="lg"
                  rounded={"full"}
                  opacity={0.7}
                  color="red.500"
                  mr={4}
                  onClick={() => handleDelete()}
                />
              </Tooltip>
            </Flex>

            <Text
              fontSize="md
              "
              fontWeight={"bold"}
              color={isPublic ? "green" : "red"}
            >
              {isPublic ? "Public" : "Private"}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Podcast</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Editing Podcast: {podcastName}
              <Box>
                <FormControl>
                  {" "}
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"
                      }
                      alt="Avatar"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        padding: "15px",
                        position: "relative",
                      }}
                    />
                    <label
                      htmlFor="avatar"
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        bottom: "15px",
                        right: "5px",
                      }}
                    >
                      <IconButton
                        aria-label="Upload avatar"
                        icon={
                          <img
                            src={
                              thumbnail ||
                              "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"
                            }
                            alt="Upload Icon"
                            width="25px"
                            height="25px"
                          />
                        }
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        border="1px solid grey"
                        padding={3}
                        style={{
                          backdropFilter: "blur(5px)", // This line adds the blur effect
                          backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent white background to enhance the blur effect
                        }}
                      />
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => handleAvatarUpload(e)}
                        style={{
                          display: "none",
                        }}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormControl>
                  <FormLabel>New Podcast Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter podcast name"
                    value={newPodcastName}
                    onChange={(e) => setNewPodcastName(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>New Description</FormLabel>
                  <Textarea
                    placeholder="Enter description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>New Tags</FormLabel>
                  <Wrap spacing={4} justify="center" maxWidth={"600px"}>
                    {PodcastGenres.map((genre) => (
                      <WrapItem key={genre}>
                        <Button
                          size="sm"
                          variant={
                            selectedTags.includes(genre) ? "solid" : "outline"
                          }
                          colorScheme="white"
                          backgroundColor={
                            selectedTags.includes(genre)
                              ? genreColors[genre] || getRandomGradient()
                              : "transparent"
                          }
                          color="white"
                          borderColor="white"
                          borderRadius="full"
                          _hover={{
                            backgroundColor: selectedTags.includes(genre)
                              ? genreColors[genre] || getRandomGradient()
                              : "gray",
                          }}
                          onClick={() => handleTagClick(genre)}
                        >
                          {genre}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                </FormControl>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updatePodcastInfo;
                setShowEditModal(false);
              }}
            >
              Save
            </Button>
            {/* Additional actions/buttons for editing */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box display="flex" flexDirection="column" px={["1em", "2em", "4em"]}>
        {episodes.map((episode) => (
          <MyEpisodes episode={episode} key={episode.id} />
        ))}
      </Box>
    </div>
  );
};

export default PodcastManager;
