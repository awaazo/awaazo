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
    if (!isLoggedIn) {
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

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handleInterestClick = (genre) => {
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== genre));
    } else {
      setSelectedInterests([...selectedInterests, genre]);
      if (!genreColors[genre]) {
        setGenreColors({ ...genreColors, [genre]: getRandomColor() });
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
            maxWidth: "20em",
          }}
        />
        <Text
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Finish Setting up Your Account
        </Text>

        <form onSubmit={handleSetup}>
          <Stack spacing={4}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FormLabel>Avatar (Optional)</FormLabel>
              <img
                src={
                  avatar ||
                  "https://images.unsplash.com/photo-1495462911434-be47104d70fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                } // Display uploaded avatar or default image
                alt="Avatar"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  padding: "15px",
                }}
              />
              <Button
                colorScheme="gray"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  width: "90%",
                }}
              >
                <label
                  htmlFor="avatar"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Upload Avatar
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
              <FormLabel>Bio (Optional)</FormLabel>
              <Textarea
                id="bio"
                placeholder="Enter your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "12px",
                  fontSize: "16px",
                }}
                resize="none"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Interests (Optional)</FormLabel>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #445670",
                  borderRadius: "4px",
                  gap: "10px",
                  maxWidth: "300px",
                }}
              >
                {PodcastGenres.map((genre) => (
                  <Button
                    key={genre}
                    style={{
                      padding: "10px",
                      fontSize: "15px",
                      cursor: "pointer",
                      backgroundColor: selectedInterests.includes(genre)
                        ? genreColors[genre] || getRandomColor()
                        : "gray",
                      border: "1px solid #000",
                      borderRadius: "4px",
                      width: "fit-content",
                    }}
                    onClick={() => handleInterestClick(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </FormControl>

            <Button
              id="setupBtn"
              type="submit"
              colorScheme="gray"
              size="lg"
              fontSize="md"
            >
              Finsh Account Setup
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Setup;
