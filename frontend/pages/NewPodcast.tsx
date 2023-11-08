import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import AuthHelper from "../helpers/AuthHelper";
import LogoWhite from "../public/logo_white.svg";
import Navbar from "../components/shared/Navbar";
import { PodcastCreateRequest } from "../utilities/Requests";
import PodcastHelper from "../helpers/PodcastHelper";
import { UserMenuInfo } from "../utilities/Interfaces";

const NewPodcast: React.FC = () => {
  // Page refs
  const createPage = "/Create";
  const mainPage = "/Main";
  const loginPage = "/auth/Login";

  // Genres
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

  // Current User
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  // Form Values
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [podcastName, setPodcastName] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");

  // Form errors
  const [createError, setCreateError] = useState("");

  // Other
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [genreColors, setGenreColors] = useState({});

  // Router
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setUser(res.userMenuInfo);
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

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
      // Success, go to main page
      window.location.href = createPage;
    } else {
      // Handle error here
      setCreateError("Cover Image, Podcast Name and Description Required.");
    }
  };

  /**
   * Returns a random dark color code
   * @returns Random Color code
   */
  function getRandomDarkColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)]; // Restrict to the first 8 characters for darker colors
    }
    return color;
  }

  /**
   * Returns a random gradient
   * @returns Random Gradient
   */
  function getRandomGradient() {
    const color1 = getRandomDarkColor();
    const color2 = getRandomDarkColor();
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  }

  /**
   * Adds/Removes a genre from selected interests
   * @param genre Interest/Genre that was clicked
   */
  const handleInterestClick = (genre: string) => {
    if (tags.includes(genre)) {
      setTags(tags.filter((item) => item !== genre));
    } else {
      setTags([...tags, genre]);
      if (!genreColors[genre]) {
        setGenreColors({ ...genreColors, [genre]: getRandomDarkColor() });
      }
    }
  };

  /**
   * Contains the elements of the Create Podcast page
   * @returns Create Podcast Page content
   */
  const NewPodcastPage = () => (
    <>
      <Navbar />
      <Box
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          style={{
            fontSize: "1.5rem",
            textAlign: "center",
            marginTop: "1rem",
            fontFamily: "Avenir Next",
          }}
        >
          Let's Make Waves: Start Your Podcast Journey
        </Text>

        <form onSubmit={handleCreate}>
          <Stack spacing={6} align={"center"}>
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
            {createError && <Text color="red.500">{createError}</Text>}

            <FormControl>
              <Input
                id="podcastName"
                placeholder="Podcast Name"
                value={podcastName}
                onChange={(e) => setPodcastName(e.target.value)}
                style={{ alignSelf: "center" }}
              />
            </FormControl>

            <FormControl>
              <Textarea
                id="description"
                placeholder="What's the Podcast about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "18px",
                }}
                resize="vertical" // Made the bio textarea resizable
              />
            </FormControl>

            <FormControl>
              <FormLabel
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                What kind of topics are on the Podcast?
              </FormLabel>
              <Wrap spacing={4} justify="center" maxWidth={"600px"}>
                {PodcastGenres.map((genre) => (
                  <WrapItem key={genre}>
                    <Button
                      size="sm"
                      variant={tags.includes(genre) ? "solid" : "outline"}
                      colorScheme="white"
                      backgroundColor={
                        tags.includes(genre)
                          ? genreColors[genre] || getRandomGradient()
                          : "transparent"
                      }
                      color="white"
                      borderColor="white"
                      borderRadius="full"
                      _hover={{
                        backgroundColor: tags.includes(genre)
                          ? genreColors[genre] || getRandomGradient()
                          : "gray",
                      }}
                      onClick={() => handleInterestClick(genre)}
                    >
                      {genre}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>
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
              Start Broadcasting
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
          </Stack>
        </form>
      </Box>
    </>
  );

  // If user is logged in, return setup page, otherwise redirect to login page
  if (user !== undefined) {
    return NewPodcastPage();
  }
};

export default NewPodcast;