import React, { useState, FormEvent, useEffect, useCallback } from "react";
import {
  Box,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Wrap,
  WrapItem,
  Center,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import AuthHelper from "../../helpers/AuthHelper";
import { PodcastCreateRequest } from "../../utilities/Requests";
import PodcastHelper from "../../helpers/PodcastHelper";
import { UserMenuInfo } from "../../utilities/Interfaces";
import CreatePodcastHeader from "../../components/CreatePodcastHeader";
import ImageAdder from "../../components/tools/ImageAdder";
import GenreSelector from "../../components/tools/GenreSelector";

export default function CreatePodcast() {
  const createPage = "/CreatorHub/MyPodcasts";
  const loginPage = "/auth/Login";
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [podcastName, setPodcastName] = useState("");
  const [podcastNameCharacterCount, setPodcastNameCharacterCount] =
    useState<number>(0);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [descriptionCharacterCount, setDescriptionCharacterCount] =
    useState<number>(0);
  const [createError, setCreateError] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
      } else {
        router.push(loginPage);
      }
    });
  }, [router]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are filled
    if (coverImageFile == null || podcastName == "" || description == "") {
      setCreateError("Cover Image, Podcast Name and Description Required.");
      return;
    }

    // Create request object
    const request: PodcastCreateRequest = {
      coverImage: coverImageFile,
      description: description,
      tags: tags,
      name: podcastName,
    };

    // Send the request
    const response = await PodcastHelper.podcastCreateRequest(request);
    console.log(response);
    if (response.status === 200) {
      router.push(createPage);
    } else {
      setCreateError(response.data);
    }
  };

  const handleGenresChange = (selectedGenres: string[]) => {
    // Update the 'tags' state with the new set of selected genres
    setTags(selectedGenres);
  };

  // Ensures podcast name is not longer than 25 characters
  const handlePodcastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setPodcastName(newName);
    setPodcastNameCharacterCount(newName.length);
  };

  // Ensures episode description is not longer than 250 characters
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDesc = e.target.value.slice(0, 250);
    setDescription(newDesc);
    setDescriptionCharacterCount(newDesc.length);
  };

  const handleImageAdded = useCallback((addedImage: string) => {
    fetch(addedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "coverImage.jpg", { type: "image/jpeg" });
        setCoverImageFile(file);
      });
  }, []);

  return (
    <>
      <Center paddingBottom={"1em"}>
        <VStack mt={"3em"}>
          <Heading fontWeight={"normal"}>Create a New Podcast</Heading>

          <Text fontSize="3xl" role="img" aria-label="giant emoji">
            ✨🎙️✨
          </Text>
        </VStack>
      </Center>
      <CreatePodcastHeader />
      <Box
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={handleCreate}>
          <Stack spacing={6} align={"center"}>
            <ImageAdder onImageAdded={handleImageAdded} />
            {createError && <Text color="red.500">{createError}</Text>}
            <FormControl position="relative">
              <Input
                id="podcastName"
                placeholder="Podcast Name"
                value={podcastName}
                onChange={handlePodcastNameChange}
                style={{ alignSelf: "center", borderRadius: "0.8em" }}
                pr="50px"
              />{" "}
              <Text
                position="absolute"
                right="8px"
                bottom="8px"
                fontSize="sm"
                color="gray.500"
              >
                {podcastNameCharacterCount}/25
              </Text>
            </FormControl>

            <FormControl position="relative">
              <Textarea
                id="description"
                placeholder="What's the Podcast about?"
                value={description}
                onChange={handleDescriptionChange}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "18px",
                }}
                resize="vertical"
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

            <FormControl>
              <FormLabel
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                Which topics are on the Podcast?
              </FormLabel>
              <GenreSelector onGenresChange={handleGenresChange} />
            </FormControl>
            <Button
              variant="gradient"
              id="createBtn"
              type="submit"
              minWidth={"200px"}
              marginTop={"3"}
              w={"12rem"}
            >
              Start Broadcasting
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
