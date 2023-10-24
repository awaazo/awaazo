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
  IconButton,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AuthHelper from "../helpers/AuthHelper";

import LogoWhite from "../public/logo_white.svg";
import { UserProfileSetupRequest } from "../utilities/Requests";
import { conforms, set } from "lodash";
import UserProfileHelper from "../helpers/UserProfileHelper";

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
  const [avatarFile, setAvatarFile] = useState<File>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    if (!isLoggedIn) {
      window.location.href = loginPage;
    }
  }, [session, router]);

  const handleAvatarUpload = (e: FormEvent) => {
    setAvatarFile((e.target as any).files[0])
    setAvatar(URL.createObjectURL((e.target as any).files[0]))  
    e.preventDefault();
  };

  const handleSetup = async (e: FormEvent) => {
    e.preventDefault();
    
    // Create request object
    const request: UserProfileSetupRequest = {
      avatar : avatarFile,
      bio : bio,
      interests : selectedInterests
    };

    // Send the request
    const response = await UserProfileHelper.profileSetupRequest(request);
    console.log(response)

    if (response.status === 200) {
      // Success, go to main page
      window.location.href = mainPage;
    }
    else {
      // Handle error here
      window.alert(response.status+": "+response.message);
    }
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
            textAlign: "center",
            marginTop: "1rem",
            fontFamily: "Avenir Next",
          }}
        >
          Hey, {session?.user?.name}! Let's get you set up.
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
              <label htmlFor="avatar" style={{ position: "absolute", cursor: "pointer", bottom: "15px", right: "5px" }}>
                <IconButton
                  aria-label="Upload avatar"
                  icon={<img src="https://img.icons8.com/?size=512&id=hwKgsZN5Is2H&format=png" alt="Upload Icon" width="25px" height="25px" />}
                  size="sm"
                  variant="outline"
                  borderRadius="full"
                  border="1px solid grey"
                  padding={3}
                  style={{
                    backdropFilter: "blur(5px)", // This line adds the blur effect
                    backgroundColor: "rgba(0, 0, 0, 0.4)" // Semi-transparent white background to enhance the blur effect
                  }}
                />
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={(e) => handleAvatarUpload(e)}
                  style={{
                    display: "none",
                  }}
                />
              </label>
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
                  borderRadius: "18px",
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
              minWidth={"200px"}
              color={"white"}
              marginTop={"15px"}
              marginBottom={"10px"}
              padding={"20px"}
              // semi transparent white outline
              outline={"1px solid rgba(255, 255, 255, 0.6)"}
              style={{
                background: 'linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)',
                backgroundSize: '300% 300%',
                animation: 'Gradient 10s infinite linear'
              }}
            >
              Start Listening
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
};

export default Setup;
