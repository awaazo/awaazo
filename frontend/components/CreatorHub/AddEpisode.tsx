import React, { useCallback, useState, FormEvent } from "react";
import { useRouter } from 'next/router';
import { FormControl, Button, Textarea, Box, VStack, Image, Input, IconButton, Flex, Switch, Text, Center, Heading, Modal, ModalContent, ModalCloseButton, ModalOverlay, Spinner } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import PodcastHelper from "../../helpers/PodcastHelper";
import { UserMenuInfo, Podcast } from "../../types/Interfaces";
import { EpisodeAddRequest } from "../../types/Requests";
import { AxiosProgressEvent } from "axios";
import ImageAdder from "../tools/ImageAdder";
import { v4 as uuidv4 } from 'uuid';

const AddEpisodeForm = ({ podcastId }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [addError, setAddError] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [episodeNameCharacterCount, setEpisodeNameCharacterCount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [descriptionCharacterCount, setDescriptionCharacterCount] = useState<number>(0);

  const [isExplicit, setIsExplicit] = useState(false);
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Modal state
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [serverError, setServerError] = useState(false);

  // Upload percentage states
  const [totalFileSize, setTotalFileSize] = useState<number>(0);
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [currentUploadedFileSize, setCurrentUploadedFileSize] = useState<number>(0);

  const MAXIMUM_FILE_SIZE = 80000000; // 80MB

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/mp3": [".mp3"],
      "audio/wav": [".wav"],
      "audio/aac": [".aac"],
      "audio/ogg": [".ogg"],
      "audio/flac": [".flac"],
      "audio/m4a": [".m4a"],
    },
    maxFiles: 1,
  });

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

    if (coverImageFile == null || episodeName == "" || description == "" || file == null) {
      setAddError("Cover Image, Episode Name and Description Required.");
      return;
    }
    setLoading(true);

    // Create an array of requests if the file is too large
    const requests: EpisodeAddRequest[] = [];

    setTotalFileSize(file.size);

    // Create request object
    const request: EpisodeAddRequest = {
      audioFile: file,
      description: description,
      thumbnail: coverImageFile,
      isExplicit: isExplicit,
      episodeName: episodeName,
    };

    // Check if the file is too large and split it into chunks if necessary
    if (file.size > MAXIMUM_FILE_SIZE) {
      console.log("File too large");
      console.log(file.size);

      // Preserving the original file information, such as the MIME type and last modified date
      const originalMimeType = file.type;
      const lastModified = file.lastModified;

      // Split the file into chunks
      const numberOfChunks = Math.ceil(file.size / MAXIMUM_FILE_SIZE);
      const chunks = [];

      // Track the start and end of the file
      let start = 0;
      let end = MAXIMUM_FILE_SIZE;

      // Generate a unique ID for the file, which will be used to identify the chunks on the server
      const id = uuidv4();

      // Track the chunk number to reconstruct the file on the server in the correct order
      let chunkNumber = 1;

      // Loop through the file, creating chunks
      while (start < file.size) {
        // Slice the file into a chunk, based on the start and end, and create a new file object with the chunk data
        chunks.push(new File([file.slice(start, end)], id + "<##>" + chunkNumber + "/" + numberOfChunks, { type: originalMimeType, lastModified: lastModified }));

        requests.push({ audioFile: chunks[chunkNumber - 1], description: description, thumbnail: coverImageFile, isExplicit: isExplicit, episodeName: episodeName } as EpisodeAddRequest);

        // Increment the chunk number and move the start and end to the next chunk
        chunkNumber++;
        start = end;
        end = start + MAXIMUM_FILE_SIZE;
      }

      console.log(chunks);
      console.log("Number of chunks: " + chunks.length);
    }
    else {
      console.log("File small enough to upload in one go.");
      requests.push(request);
    }

    console.log(requests);


    setServerError(false);
    setUploadModalOpen(true);

    let response: any;
    let episodeId: string;

    // Send the requests
    for (let i = 0; i < requests.length; i++) {
      console.log("Sending request " + i);
      console.log(requests[i]);

      if (i === 0) {
        // Add the episode and get the episode ID
        response = await PodcastHelper.episodeAddRequest(requests[i], podcastId, onUploadProgress);
        episodeId = response.data;
      }
      else {
        // Add the audio chunks to the episode
        response = await PodcastHelper.episodeAddAudioRequest(requests[i], episodeId, onUploadProgress);
      }

      console.log(response);

      if (response.status !== 200) {
        setServerError(true);
        setAddError(response.data);
      }
    }

    setLoading(false);
  };

  // Define the progress callback
  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

    console.log(progressEvent)


    setUploadProgress(progress);

    console.log("Progress: " + progress+"%"+ " Loaded: "+progressEvent.loaded+" Total: "+progressEvent.total);
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
      {/* Form Container */}
      <Center>
        <VStack spacing={2} align="center" p={2}>
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

                  <Box w="100%" h="32px" borderRadius="full" mt={2} mb={2} position="relative" background="grey">
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
                    <Button onClick={() => window.location.reload()} alignSelf="center" variant="gradient">
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

export default AddEpisodeForm;
