import React, { useCallback, useState, FormEvent, useEffect } from "react";
import { FormControl, Button, Textarea, Box, VStack, Image, Input, IconButton, Flex, Switch, Text, Center, Heading, Modal, ModalContent, ModalCloseButton, ModalOverlay, Spinner } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import PodcastHelper from "../../helpers/PodcastHelper";
import AuthHelper from "../../helpers/AuthHelper";
import { AddIcon } from "@chakra-ui/icons";
import router from "next/router";
import { UserMenuInfo, Podcast } from "../../utilities/Interfaces";
import { EpisodeAddRequest } from "../../utilities/Requests";
import { AxiosProgressEvent } from "axios";
import ImageAdder from "../../components/tools/ImageAdder";

const AddEpisode = () => {
  const loginPage = "/auth/Login";
  const myPodcastsPage = "/CreatorHub/MyPodcasts";

  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [addError, setAddError] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [episodeNameCharacterCount, setEpisodeNameCharacterCount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [descriptionCharacterCount, setDescriptionCharacterCount] = useState<number>(0);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast>(null);
  const [isExplicit, setIsExplicit] = useState(false);
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Modal state
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status == 200) {
        setUser(res.userMenuInfo);
        PodcastHelper.podcastMyPodcastsGet(0, 12).then((res2) => {
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/mp3': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/aac': ['.aac'],
      'audio/ogg': ['.ogg'],
      'audio/flac': ['.flac'],
      'audio/m4a': ['.m4a'],
    },
    maxFiles: 1,
  });
  

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };

  const [loading, setLoading] = useState(false);

  const handleImageAdded = useCallback(async (addedImageUrl: string) => {
    try {
      const response = await fetch(addedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "cover-image.jpg", { type: "image/jpeg" });
      setCoverImageFile(file);
      setCoverImage(addedImageUrl);
    } catch (error) {
      console.error("Error converting image URL to File:", error);
    }
  }, []);

  const handleAddEpisode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (selectedPodcast == null) {
      setAddError("Please select the Podcast you wish to upload to");
    } else {
      if (coverImageFile == null || episodeName == "" || description == "" || file == null) {
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
      const response = await PodcastHelper.episodeAddRequest(request, selectedPodcast.id, onUploadProgress);
      console.log(response);

      setLoading(false);

      if (response.status === 200) {
      } else {
        setServerError(true);
        setAddError(response.data);
      }
    }
  };

  // Define the progress callback
  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
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
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          <Heading fontWeight={"normal"}>Upload Episode</Heading>
          <Text mb={"1em"}>Choose a Podcast</Text>
        </VStack>
      </Center>

      <Box display="flex" width="100%" justifyContent="center">
        <Flex direction="row" wrap="wrap" justifyContent="center" alignItems="center">
          {podcasts.map((podcast) => (
            <Flex
              key={podcast.id}
              direction="column"
              alignItems="center"
              bg={selectedPodcast && selectedPodcast.id === podcast.id ? "brand.100" : "transparent"}
              borderRadius="1em"
              cursor="pointer"
              outline={selectedPodcast && selectedPodcast.id === podcast.id ? "1px solid brand.100" : "none"}
              onClick={() => handlePodcastSelect(podcast)}
              p={2}
              m={2}
            >
              <Image src={podcast.coverArtUrl} alt={podcast.name} boxSize="100px" borderRadius="2em" objectFit="cover" boxShadow="lg" outline="2px solid #FFFFFF80" data-cy={`podcast-image-${podcast.name.replace(/\s+/g, "-").toLowerCase()}`} />
              <Text mt={2}> {podcast.name.length > 18 ? `${podcast.name.substring(0, 18)}...` : podcast.name}</Text>
            </Flex>
          ))}

          {/* Create a Podcast Option */}
          <Flex direction="column" alignItems="center" borderRadius="1em" cursor="pointer" outline="none" onClick={navigateToCreatePodcast} p={2} m={2} bg="transparent">
            <Box boxSize="100px" borderRadius="2em" border="2px dashed gray" display="flex" alignItems="center" justifyContent="center" data-cy="create-podcast-box">
              <AddIcon w={8} h={8} />
            </Box>
            <Text mt={2}>Create a Podcast</Text>
          </Flex>
        </Flex>
      </Box>

      {/* Form Container */}
      <Center>
        <VStack spacing={5} align="center" p={5}>
          <form onSubmit={handleAddEpisode}>
            {addError && <Text color="red.500">{addError}</Text>}
            <VStack spacing={5} align="center" p={5}>
              <ImageAdder onImageAdded={handleImageAdded} />
              {/* Episode Name Input */}
              <FormControl position="relative">
                <Input value={episodeName} onChange={handleEpisodeNameChange} placeholder="Enter episode name..." rounded="lg" pr="50px" />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                  {episodeNameCharacterCount}/25
                </Text>
              </FormControl>

              {/* Description Textarea */}
              <FormControl position="relative">
                <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter episode description..." />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                  {descriptionCharacterCount}/250
                </Text>
              </FormControl>

              {/* Genre Selection */}
              <FormControl display="flex" alignItems="center" justifyContent="center">
                <Switch id="explicitToggle" colorScheme="purple" isChecked={isExplicit} onChange={() => setIsExplicit(!isExplicit)} opacity={0.9}>
                  Explicit
                </Switch>
              </FormControl>

              {/* File Upload */}
              <Box {...getRootProps()} border="2px dotted gray" borderRadius="3xl" p={4} textAlign="center" width="300px" data-cy="podcast-file-dropzone">
                <input {...getInputProps()} />
                {file ? (
                  <Text>{file.name}</Text>
                ) : (
                  <Text>
                    Drag & drop an audio file here, or click to select one
                    <Text role="img" aria-label="audio emoji">
                      {" "}
                      🎙️
                    </Text>
                  </Text>
                )}
              </Box>

              {/* Upload Button */}
              <Button id="createBtn" type="submit" variant={"gradient"} disabled={loading} w={"12rem"}>
                {loading ? <Spinner /> : "Upload"}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Center>
      <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} isCentered>
        <ModalOverlay />

        <ModalContent borderRadius="xl" backdropFilter="blur(50px)" p={9} maxW="800px" width="95%">
          <Flex direction="column">
            <Flex align="start">
              {coverImage && <Image src={coverImage} alt="Uploaded Cover Photo" boxSize="120px" borderRadius="8px" objectFit="cover" boxShadow="lg" />}
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
                      <Text fontSize="xs" textAlign="center" color="white" mb={2}>
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
                        background: "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
                        backgroundSize: "300% 300%",
                        animation: "Gradient 3s infinite linear",
                      }}
                      position="absolute"
                      zIndex="1"
                    />

                    <Text position="absolute" width="100%" textAlign="center" color="white" fontWeight="bold" fontSize="xl" zIndex="2">
                      {uploadProgress}%
                    </Text>
                  </Box>
                  {uploadProgress === 100 && (
                    <Button onClick={() => (window.location.href = myPodcastsPage)} alignSelf="center" bg="rgba(169, 169, 169, 0.2)">
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

export default AddEpisode;
