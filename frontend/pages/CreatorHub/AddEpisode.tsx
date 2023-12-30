import React, { useCallback, useState, FormEvent, useEffect } from "react";
import {
  FormControl,
  Button,
  Textarea,
  Box,
  VStack,
  Image,
  Input,
  IconButton,
  Flex,
  Switch,
  useColorMode,
  Text,
  Center,
  Heading,
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import PodcastHelper from "../../helpers/PodcastHelper";
import AuthHelper from "../../helpers/AuthHelper";

import { AddIcon } from "@chakra-ui/icons";
import router from "next/router";
import { UserMenuInfo, Podcast } from "../../utilities/Interfaces";
import { EpisodeAddRequest } from "../../utilities/Requests";
import { AxiosProgressEvent } from "axios";

const CreateEpisode = () => {
  // Page refs
  const loginPage = "/auth/Login";
  const myPodcastsPage = "/CreatorHub/MyPodcasts";

  // Current User
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  // Form errors
  const [addError, setAddError] = useState("");

  // Form values
  const [episodeName, setEpisodeName] = useState("");
  const [episodeNameCharacterCount, setEpisodeNameCharacterCount] =
    useState<number>(0);
  const [description, setDescription] = useState("");
  const [descriptionCharacterCount, setDescriptionCharacterCount] =
    useState<number>(0);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast>(null);
  const [isExplicit, setIsExplicit] = useState(false);
  const [file, setFile] = useState(null);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const handleCoverImageUpload = (e: FormEvent) => {
    setCoverImageFile((e.target as any).files[0]);
    setCoverImage(URL.createObjectURL((e.target as any).files[0]));
    e.preventDefault();
  };

  // Modal state
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
        PodcastHelper.podcastMyPodcastsGet(0, 12).then((res2) => {
          // If logged in, set user, otherwise redirect to login page
          if (res2.status == 200) {
            setPodcasts(res2.myPodcasts);
          } else {
            setAddError("Podcasts cannot be fetched");
          }
        });
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { colorMode } = useColorMode();

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission
   * @param e Click event
   */
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedPodcast == null) {
      setAddError("Please select the Podcast you wish to upload to");
    } else {
      if (
        coverImageFile == null ||
        episodeName == "" ||
        description == "" ||
        file == null
      ) {
        setAddError("Cover Image, Episode Name and Description Required.");
        return;
      }

      // Create request object
      const request: EpisodeAddRequest = {
        audioFile: file,
        description: description,
        thumbnail: coverImageFile,
        isExplicit: isExplicit,
        episodeName: episodeName,
      };
      setServerError(false);
      setUploadModalOpen(true);
      // Send the request
      const response = await PodcastHelper.episodeAddRequest(
        request,
        selectedPodcast.id,
        onUploadProgress,
      );
      console.log(response);

      setLoading(false);

      if (response.status === 200) {
        // Ensure all required fields are filled
        // Show modal with progress bar
      } else {
        // Handle error here
        setServerError(true);
        setAddError(response.data);
      }
    }
  };

  // Define the progress callback
  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const progress = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100,
    );
    setUploadProgress(progress);
    console.log(progress);
  };

  // Ensures episode name is not longer than 25 characters
  const handleEpisodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setEpisodeName(newName);
    setEpisodeNameCharacterCount(newName.length);
  };

  // Ensures episode description is not longer than 250 characters
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDesc = e.target.value.slice(0, 250);
    setDescription(newDesc);
    setDescriptionCharacterCount(newDesc.length);
  };

  // Function to navigate to create podcast page
  const navigateToCreatePodcast = () => {
    router.push("/CreatorHub/CreatePodcast");
  };

  return (
    <>
      <Center>
        <VStack mt={"1em"}>
          <Heading fontWeight={"normal"}>
            Upload Episode
          </Heading>
          <Text mb={"1em"}>Choose a Podcast</Text>
        </VStack>
      </Center>

      <Box display="flex" width="100%" justifyContent="center">
        <Flex
          direction="row"
          wrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          {podcasts.map((podcast) => (
            <Flex
              key={podcast.id}
              direction="column"
              alignItems="center"
              bg={
                selectedPodcast && selectedPodcast.id === podcast.id
                  ? colorMode === "light"
                    ? "#00000010"
                    : "#FFFFFF10"
                  : "transparent"
              }
              borderRadius="1em"
              cursor="pointer"
              outline={
                selectedPodcast && selectedPodcast.id === podcast.id
                  ? "2px solid #3182CE"
                  : "none"
              }
              onClick={() => handlePodcastSelect(podcast)}
              p={2}
              m={2}
            >
              <Image
                src={podcast.coverArtUrl}
                alt={podcast.name}
                boxSize="100px"
                borderRadius="2em"
                objectFit="cover"
                boxShadow="lg"
                outline="2px solid #FFFFFF80"
                data-cy={`podcast-image-${podcast.name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`} // Adding a data-cy attribute to the Image component
              />
              <Text mt={2}>
                {" "}
                {podcast.name.length > 18
                  ? `${podcast.name.substring(0, 18)}...`
                  : podcast.name}
              </Text>
            </Flex>
          ))}

          {/* Create a Podcast Option */}
          <Flex
            direction="column"
            alignItems="center"
            borderRadius="1em"
            cursor="pointer"
            outline="none"
            onClick={navigateToCreatePodcast}
            p={2}
            m={2}
            bg="transparent"
          >
            <Box
              boxSize="100px"
              borderRadius="2em"
              border="2px dashed gray"
              display="flex"
              alignItems="center"
              justifyContent="center"
              data-cy="create-podcast-box"
            >
              <AddIcon w={8} h={8} />
            </Box>
            <Text mt={2}>Create a Podcast</Text>
          </Flex>
        </Flex>
      </Box>

      {/* Form Container */}
      <Box display="flex" justifyContent="center">
        <VStack spacing={5} align="center" p={5}>
          {/* Form Container */}
          {/* Displaying Selected Podcast Title */}
          {selectedPodcast && (
            <Text
              fontSize="xl"
              fontWeight="normal"
              bg={
                colorMode === "light"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(255, 255, 255, 0.1)"
              } // Slight transparency
              pl={5} // Padding for better visual spacing
              pr={5} // Padding for better visual spacing
              pt={2} // Padding for better visual spacing
              pb={2} // Padding for better visual spacing
              mb={5} // Margin for better visual spacing
              borderRadius="5em" // Rounded corners
              outline={
                colorMode === "light"
                  ? "1px solid #000000"
                  : "1px solid #FFFFFF"
              } // Black or white border
              fontFamily={"Avenir Next"}
            >
              {`${selectedPodcast.name}`}
            </Text>
          )}
          <form onSubmit={handleAdd}>
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
                  coverImage ||
                  "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"
                }
                alt="Cover Photo"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  padding: "15px",
                  position: "relative",
                }}
              />
              <label
                htmlFor="Cover Photo"
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  bottom: "15px",
                  right: "5px",
                }}
              >
                <IconButton
                  aria-label="Upload Cover Photo"
                  icon={
                    <img
                      src="https://img.icons8.com/?size=512&id=hwKgsZN5Is2H&format=png"
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
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  }}
                  zIndex={-999}
                />
                <input
                  type="file"
                  id="Cover Photo"
                  accept="image/*"
                  onChange={(e) => handleCoverImageUpload(e)}
                  style={{
                    display: "none",
                  }}
                />
              </label>
            </div>
            {addError && <Text color="red.500">{addError}</Text>}
            <VStack spacing={5} align="center" p={5}>
              {/* Episode Name Input */}
              <FormControl position="relative">
                <Input
                  value={episodeName}
                  onChange={handleEpisodeNameChange}
                  placeholder="Enter episode name..."
                  rounded="lg"
                  pr="50px"
                />
                <Text
                  position="absolute"
                  right="8px"
                  bottom="8px"
                  fontSize="sm"
                  color="gray.500"
                >
                  {episodeNameCharacterCount}/25
                </Text>
              </FormControl>

              {/* Description Textarea */}
              <FormControl position="relative">
                <Textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter episode description..."
                />
                <Text
                  position="absolute"
                  right="8px"
                  bottom="8px"
                  fontSize="sm"
                  color="gray.500"
                >
                  {descriptionCharacterCount}/250
                </Text>
              </FormControl>

              {/* Genre Selection */}
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Switch
                  id="explicitToggle"
                  colorScheme="purple"
                  isChecked={isExplicit}
                  onChange={() => setIsExplicit(!isExplicit)}
                  opacity={0.9} // Setting the opacity to 0.7 to make it slightly faded
                >
                  Explicit
                </Switch>
              </FormControl>

              {/* File Upload */}
              <Box
                {...getRootProps()}
                border="2px dashed gray"
                borderRadius="md"
                p={4}
                textAlign="center"
                width="300px"
                data-cy="podcast-file-dropzone"
              >
                <input {...getInputProps()} />
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <p>Drag & drop a podcast file here, or click to select one</p>
                )}
              </Box>

              {/* Upload Button */}
              <Button
                id="createBtn"
                type="submit"
                fontSize="md"
                borderRadius={"full"}
                minWidth={"200px"}
                color={"white"}
                marginTop={"15px"}
                marginBottom={"10px"}
                padding={"20px"}
                // semi transparent white outline
                outline={"1px solid rgba(255, 255, 255, 0.6)"}
                style={{
                  background:
                    "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
                  backgroundSize: "300% 300%",
                  animation: "Gradient 10s infinite linear",
                }}
                disabled={loading}
              >
                {loading ? <Spinner /> : "Upload"}
                <style jsx>{`
                  @keyframes Gradient {
                    0% {
                      background-position: 100% 0%;
                    }
                    50% {
                      background-position: 0% 100%;
                    }
                    100% {
                      background-position: 100% 0%;
                    }
                  }
                `}</style>
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      >
        <ModalOverlay />

        <ModalContent
          borderRadius="xl"
          backdropFilter="blur(50px)"
          p={9}
          maxW="800px"
          width="95%"
        >
          <ModalCloseButton />

          <Flex direction="column">
            <Flex align="start">
              {coverImage && (
                <Image
                  src={coverImage}
                  alt="Uploaded Cover Photo"
                  boxSize="120px"
                  borderRadius="8px"
                  objectFit="cover"
                  boxShadow="lg"
                />
              )}
              <Box ml={4}>
                <Text fontSize="25px" fontWeight={"bold"}>
                  Uploading: {episodeName}
                </Text>
                <Text fontSize="15px" mt={3} ml={1}>
                  {description}
                </Text>
              </Box>
            </Flex>
            <Flex direction="column" align="center" mt={5}>
              {serverError ? (
                <Box textAlign="center">
                  <Text fontSize="lg" textAlign="center" color="red" mb={2}>
                    {addError}
                  </Text>
                </Box>
              ) : (
                <>
                  <Box textAlign="center">
                    {uploadProgress !== 100 && (
                      <Text
                        fontSize="xs"
                        textAlign="center"
                        color="white"
                        mb={2}
                      >
                        Please wait while the file gets uploaded
                      </Text>
                    )}
                  </Box>

                  <Box
                    w="100%"
                    h="32px"
                    borderRadius="full"
                    mt={2}
                    mb={2}
                    position="relative"
                    style={{
                      background: "grey",
                    }}
                  >
                    <Box
                      h="100%"
                      borderRadius="full"
                      width={`${uploadProgress}%`}
                      style={{
                        background:
                          "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
                        backgroundSize: "300% 300%",
                        animation: "Gradient 3s infinite linear",
                      }}
                      position="absolute"
                      zIndex="1"
                    />

                    <Text
                      position="absolute"
                      width="100%"
                      textAlign="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="xl"
                      zIndex="2"
                    >
                      {uploadProgress}%
                    </Text>
                  </Box>
                  {uploadProgress === 100 && (
                    <Button
                      onClick={() => router.push("/CreatorHub/MyPodcasts")}
                      alignSelf="center"
                      bg="rgba(169, 169, 169, 0.2)"
                    >
                      Finish
                    </Button>
                  )}
                </>
              )}
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateEpisode;
