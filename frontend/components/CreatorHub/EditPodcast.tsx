import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Box, Textarea, Button, FormControl, FormLabel, Input, Stack, Text, IconButton, Img } from "@chakra-ui/react";
import { PodcastEditRequest } from "../../utilities/Requests";
import PodcastHelper from "../../helpers/PodcastHelper";
import GenreSelector from "../tools/GenreSelector";

export default function EditPodcastForm({ podcastId }) {
  useEffect(() => {
    console;
    PodcastHelper.getPodcastById(podcastId).then((res) => {
      if (res.status == 200) {
        setCoverImage(res.podcast.coverArtUrl);
        setPodcastName(res.podcast.name);
        setPodcastNameCharacterCount(res.podcast.name.length);
        setDescription(res.podcast.description);
        setDescriptionCharacterCount(res.podcast.description.length);
        setTags(res.podcast.tags);
      } else {
        setEditError("Podcasts cannot be fetched");
      }
    });
  }, [podcastId]);
  // Page refs
  const myPodcastsPage = "/CreatorHub";

  // Form Values
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [podcastName, setPodcastName] = useState("");
  const [podcastNameCharacterCount, setPodcastNameCharacterCount] = useState<number>(0);
  const [tags, setTags] = useState([]);
  const [descriptionCharacterCount, setDescriptionCharacterCount] = useState<number>(0);
  const [description, setDescription] = useState("");

  // Form errors
  const [editError, setEditError] = useState("");

  // Other
  const [coverImage, setCoverImage] = useState<string | null>("");

  /**
   * Handles Cover Image upload
   * @param e Upload event
   */
  const handleCoverImageUpload = (e: FormEvent) => {
    setCoverImageFile((e.target as any).files[0]);
    setCoverImage(URL.createObjectURL((e.target as any).files[0]));
    e.preventDefault();
  };

  /**
   * Handles form submission
   * @param e Click event
   */
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are filled
    if (podcastName == "" || description == "") {
      setEditError("Cover Image, Podcast Name and Description Required.");
      return;
    }
    // Create request object
    const request: PodcastEditRequest = {
      Id: podcastId,
      coverImage: coverImageFile,
      description: description,
      tags: tags,
      name: podcastName,
    };

    // Send the request
    const response = await PodcastHelper.podcastEditRequest(request);
    console.log(response);

    if (response.status === 200) {
      // Success, go to my podcasts page
      window.location.href = myPodcastsPage;
    } else {
      // Handle error here
      setEditError(response.data);
    }
  };

  // Ensures podcast name is not longer than 25 characters
  const handlePodcastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25);
    setPodcastName(newName);
    setPodcastNameCharacterCount(newName.length);
  };

  // Ensures episode description is not longer than 250 characters
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value.slice(0, 250);
    setDescription(newDesc);
    setDescriptionCharacterCount(newDesc.length);
  };

  const handleInterestClick = (selectedGenres: string[]) => {
    setTags(selectedGenres);
  };
  /**
   * Contains the elements of the Create Podcast page
   * @returns Create Podcast Page content
   */
  return (
    <>
      <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <form onSubmit={handleCreate}>
          <Stack spacing={6} align={"center"}>
            <Box position="relative" display="flex" flexDirection="column" alignItems="center">
              <Img src={coverImage || "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"} alt="Cover Photo" width="150px" height="150px" padding="15px" position="relative" borderRadius="20%" />
              <label htmlFor="Cover Photo">
                <IconButton
                  aria-label="Upload Cover Photo"
                  icon={<img src="https://img.icons8.com/?size=512&id=hwKgsZN5Is2H&format=png" alt="Upload Icon" width="25px" height="25px" />}
                  size="sm"
                  variant="outline"
                  borderRadius="full"
                  border="1px solid grey"
                  padding={3}
                  backdropFilter="blur(5px)"
                  backgroundColor="rgba(0, 0, 0, 0.4)"
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
            </Box>
            {editError && <Text color="red.500">{editError}</Text>}

            <FormControl position="relative">
              <Input id="podcastName" placeholder="Podcast Name" value={podcastName} onChange={handlePodcastNameChange} style={{ alignSelf: "center", borderRadius: "0.8em" }} pr="50px" />{" "}
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {podcastNameCharacterCount}/25
              </Text>
            </FormControl>

            <FormControl position="relative">
              <Textarea id="description" placeholder="What's the Podcast about?" value={description} onChange={handleDescriptionChange} width="100%" height="100px" padding="12px" fontSize="16px" borderRadius="18px" resize="vertical" />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {descriptionCharacterCount}/250
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel textAlign="center" padding="10px">
                What kind of topics are on the Podcast?
              </FormLabel>
              <GenreSelector onGenresChange={handleInterestClick} />
            </FormControl>
            <Button id="createBtn" type="submit" variant="gradient">
              Update
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
