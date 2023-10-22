import React, { useState, FormEvent, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AuthHelper from "../helpers/AuthHelper";

import LogoWhite from "../public/logo_white.svg";

const Setup: React.FC = () => {
  // CONSTANTS
  const mainPage = "/Main";
  const loginPage = "/auth/Login";
  const elementsPerLine = 3;

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
  const isLoggedIn = AuthHelper.isLoggedIn();
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [genreColors, setGenreColors] = useState({});
  const [avatar, setAvatar] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    if (isLoggedIn) {
      window.location.href = loginPage;
    }
  }, [session, router]);

  const handleAvatarUpload = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleSetup = async (e: FormEvent) => {
    e.preventDefault();

    //window.location.href = mainPage;
  };

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

  const handleInterestClick = (genre) => {
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== genre));
    } else {
      setSelectedInterests([...selectedInterests, genre]);
      if (!genreColors[genre]) {
        setGenreColors({ ...genreColors, [genre]: getRandomDarkColor() });
      }
    }
  };

  return (
    <>
      <Box
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <img
          src={LogoWhite.src}
          alt="logo"
          style={{
            maxHeight: "10em",
            maxWidth: "3em",
          }}
        />
        <Text
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Finish Setting up Your Account
        </Text>

         <form onSubmit={handleSetup}>
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
                  avatar ||
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
              <Button
                colorScheme="gray"
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  padding: "5px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.8rem", // Smaller font size
                }}
              >
                <label
                  htmlFor="avatar"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Upload
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) =>
                    setAvatar(URL.createObjectURL(e.target.files[0]))
                  }
                  style={{
                    display: "none",
                  }}
                />
              </Button>
            </div>

            <FormControl>
              <Textarea
                id="bio"
                placeholder="What's your story? (Optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  fontSize: "16px",
                }}
                resize="vertical" // Made the bio textarea resizable
              />
            </FormControl>

             <FormControl>
              <FormLabel style={
                {
                   textAlign: "center",
                   padding: "10px",
                  }
                   }>
                What kind of topics do you like?
              </FormLabel>
              <Wrap spacing={4} justify="center" maxWidth={"600px"}>
    {PodcastGenres.map((genre) => (
      <WrapItem key={genre}>
        <Button
          size="sm"
          variant={selectedInterests.includes(genre) ? "solid" : "outline"}
          colorScheme="white"
          backgroundColor={
            selectedInterests.includes(genre)
              ? genreColors[genre] || getRandomGradient()
              : "transparent"
          }
          color="white"
          borderColor="white"
          borderRadius="full"
          _hover={{
            backgroundColor: selectedInterests.includes(genre)
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
              id="setupBtn"
              type="submit"
              fontSize="md"
              borderRadius={"full"}
              backgroundColor="white"
              maxWidth={"200px"}
              color={"black"}
              marginTop={"15px"}
              marginBottom={"10px"}
            >
              Finish Account Setup
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Setup;
