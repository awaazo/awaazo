import React, { useCallback, useState, FormEvent, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Box,
  VStack,
  Image,
  Input,
  IconButton,
  Grid,
  GridItem,
  Select,
  Flex,
  Switch,
  HStack,
  useColorMode,
  Text,
  Center,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import PodcastHelper from "../helpers/PodcastHelper";
import AuthHelper from "../helpers/AuthHelper";
import Navbar from "../components/shared/Navbar";
import { AddIcon } from "@chakra-ui/icons";
import router from "next/router";
import { UserMenuInfo, Podcast } from "../utilities/Interfaces";
import { EpisodeAddRequest } from "../utilities/Requests";
import LogoWhite from "../public/logo_white.svg";

const CreateEpisode = () => {
  // Page refs
  const loginPage = "/auth/Login";
  const myPodcastsPage = "/MyPodcasts";

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

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
        PodcastHelper.podcastMyPodcastsGet().then((res2) => {
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

  /**
   * Handles form submission
   * @param e Click event
   */
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedPodcast == null) {
      setAddError("Please select the Podcast you wish to upload to");
    } else {
      // Ensure all required fields are filled
      if (
        (coverImageFile == null && coverImage == null) ||
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

      // Send the request
      const response = await PodcastHelper.episodeAddRequest(
        request,
        selectedPodcast.id
      );
      console.log(response);

      if (response.status === 200) {
        // Success, go to my podcasts page
        window.location.href = myPodcastsPage;
      } else {
        // Handle error here
        setAddError(response.data);
      }
    }
  };

  // Ensures episode name is not longer than 25 characters
  const handleEpisodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setEpisodeName(newName);
    setEpisodeNameCharacterCount(newName.length);
  };

  // Ensures episode description is not longer than 250 characters
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDesc = e.target.value.slice(0, 250);
    setDescription(newDesc);
    setDescriptionCharacterCount(newDesc.length);
  };

  // Function to navigate to create podcast page
  const navigateToCreatePodcast = () => {
    router.push("/NewPodcast");
  };

  return (
    <>
      <Navbar />
      <Center>
        <VStack mt={"1em"}>
          <Heading fontWeight={"normal"} fontFamily={"Avenir Next"}>
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
                data-cy={`podcast-image-${podcast.name.replace(/\s+/g, '-').toLowerCase()}`}
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
                src={selectedPodcast?.coverArtUrl}
                alt="Cover Photo"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  padding: "15px",
                  position: "relative",
                  objectFit: "cover",
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
              >
                <input {...getInputProps()} accept=".mp3, .wav, .mp4, .mpeg" />
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
              >
                Upload
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
    </>
  );
};

export default CreateEpisode;
