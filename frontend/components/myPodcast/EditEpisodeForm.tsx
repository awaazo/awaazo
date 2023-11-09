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
import PodcastHelper from "../../helpers/PodcastHelper";
import router from "next/router";
import { UserMenuInfo, Podcast } from "../../utilities/Interfaces";
import { EpisodeEditRequest } from "../../utilities/Requests";

export default function EditEpisodeForm({ episode }) {
  useEffect(() => {
    PodcastHelper.getEpisodeById(episode.id).then((res) => {
      if (res.status == 200) {
        setCoverImage(res.episode.thumbnailUrl);
        setEpisodeName(res.episode.episodeName);
        setDescription(res.episode.description);
        setIsExplicit(res.episode.isExplicit);
      } else {
        setEditError("Episodes cannot be fetched");
      }
    });
  }, [episode.id]);
  // Page refs
  const myPodcastsPage = "/MyPodcasts";

  // Form errors
  const [editError, setEditError] = useState("");

  // Form values
  const [episodeName, setEpisodeName] = useState("");
  const [description, setDescription] = useState("");
  const [isExplicit, setIsExplicit] = useState(false);
  const [file, setFile] = useState(null);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const handleCoverImageUpload = (e: FormEvent) => {
    setCoverImageFile((e.target as any).files[0]);
    setCoverImage(URL.createObjectURL((e.target as any).files[0]));
    e.preventDefault();
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { colorMode } = useColorMode();

  /**
   * Handles form submission
   * @param e Click event
   */
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    // Create request object
    const request: EpisodeEditRequest = {
      audioFile: file,
      description: description,
      thumbnail: coverImageFile,
      isExplicit: isExplicit,
      episodeName: episodeName,
    };

    // Send the request
    const response = await PodcastHelper.podcastEpisodeEditRequest(
      request,
      episode.id,
    );
    console.log(response);

    if (response.status === 200) {
      // Success, go to my podcasts page
      window.location.href = myPodcastsPage;
    } else {
      // Handle error here
      setEditError("Episode File, Name and Description Required.");
    }
  };

  return (
    <>
      {/* Form Container */}
      <Box display="flex" justifyContent="center">
        <VStack spacing={5} align="center" p={5}>
          <form onSubmit={handleUpdate}>
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
            {editError && <Text color="red.500">{editError}</Text>}
            <VStack spacing={5} align="center" p={5}>
              {/* Episode Name Input */}
              <FormControl>
                <Input
                  value={episodeName}
                  onChange={(e) => setEpisodeName(e.target.value)}
                  placeholder="Enter episode name..."
                  rounded="lg"
                />
              </FormControl>

              {/* Description Textarea */}
              <FormControl>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter episode description..."
                />
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
                <input {...getInputProps()} />
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <p>Drag & drop a podcast file here, or click to select one</p>
                )}
              </Box>

              {/* Update Button */}
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
                Update
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
              {/* Update Button */}
            </VStack>
          </form>
        </VStack>
      </Box>
    </>
  );
}
