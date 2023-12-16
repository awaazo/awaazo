import React, { useState, FormEvent, useEffect } from "react";
import { Box, Textarea, Button, FormControl, FormLabel, Input, Stack, Text, Wrap, WrapItem, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AuthHelper from "../../helpers/AuthHelper";
import LogoWhite from "../public/logo_white.svg";
import { UserProfileSetupRequest } from "../../utilities/Requests";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { UserMenuInfo } from "../../utilities/Interfaces";

const ProfileSetup: React.FC = () => {
  // CONSTANTS

  // Page refs
  const mainPage = "/";
  const loginPage = "/auth/Login";

  // Genres
  const PodcastGenres = ["Technology", "Comedy", "Science", "History", "News", "True Crime", "Business", "Health", "Education", "Travel", "Music", "Arts", "Sports", "Politics", "Fiction", "Food"];

  // Current User
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  // Form Values
  const [displayName, setDisplayName] = useState("");
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState<number>(0);
  const [bio, setBio] = useState("");
  const [bioCharacterCount, setBioCharacterCount] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form errors
  const [setupError, setSetupError] = useState("");

  // Other
  const [avatar, setAvatar] = useState<string | null>(null);
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
   * Handles Avatar upload
   * @param e Upload event
   */
  const handleAvatarUpload = (e: FormEvent) => {
    setAvatarFile((e.target as any).files[0]);
    setAvatar(URL.createObjectURL((e.target as any).files[0]));
    e.preventDefault();
  };

  /**
   * Handles form submission
   * @param e Click event
   */
  const handleSetup = async (e: FormEvent) => {
    e.preventDefault();

    // Create request object
    const request: UserProfileSetupRequest = {
      avatar: avatarFile,
      bio: bio,
      interests: selectedInterests,
      displayName: displayName,
    };

    // Send the request
    const response = await UserProfileHelper.profileSetupRequest(request);
    console.log(response);

    if (response.status === 200) {
      // Success, go to main page
      window.location.href = mainPage;
    } else {
      // Handle error here
      setSetupError("Avatar, Display Name and Bio Required.");
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
    if (selectedInterests.includes(genre)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== genre));
    } else {
      setSelectedInterests([...selectedInterests, genre]);
      if (!genreColors[genre]) {
        setGenreColors({ ...genreColors, [genre]: getRandomDarkColor() });
      }
    }
  };

  // Ensures display name is not longer than 25 characters
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = e.target.value.slice(0, 25);
    setDisplayName(newDisplayName);
    setDisplayNameCharacterCount(newDisplayName.length);
  };

  // Ensures bio is not longer than 250 characters
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value.slice(0, 250);
    setBio(newBio);
    setBioCharacterCount(newBio.length);
  };

  /**
   * Contains the elements of the Setup page
   * @returns Setup Page content
   */
  const SetupPage = () => (
    <>
      <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
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
          Hey, @{user.username}! Let's get you set up.
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
                src={avatar || "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"}
                alt="Avatar"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  padding: "15px",
                  position: "relative",
                }}
              />
              <label
                htmlFor="avatar"
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  bottom: "15px",
                  right: "5px",
                }}
              >
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
                    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent white background to enhance the blur effect
                  }}
                  zIndex={-999}
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
            {setupError && <Text color="red.500">{setupError}</Text>}

            <FormControl position="relative">
              <Input id="displayName" placeholder="Display Name" value={displayName} onChange={handleDisplayNameChange} style={{ alignSelf: "center" }} />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {displayNameCharacterCount}/25
              </Text>
            </FormControl>

            <FormControl position="relative">
              <Textarea
                id="bio"
                placeholder="What's your story? (Optional)"
                value={bio}
                onChange={handleBioChange}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "18px",
                }}
                resize="vertical"
              />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {bioCharacterCount}/250
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                What kind of topics do you like?
              </FormLabel>
              <Wrap spacing={4} justify="center" maxWidth={"600px"}>
                {PodcastGenres.map((genre) => (
                  <WrapItem key={genre}>
                    <Button
                      size="sm"
                      variant={selectedInterests.includes(genre) ? "solid" : "outline"}
                      colorScheme="white"
                      backgroundColor={selectedInterests.includes(genre) ? genreColors[genre] || getRandomGradient() : "transparent"}
                      color="white"
                      borderColor="white"
                      borderRadius="full"
                      _hover={{
                        backgroundColor: selectedInterests.includes(genre) ? genreColors[genre] || getRandomGradient() : "gray",
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
                background: "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
                backgroundSize: "300% 300%",
                animation: "Gradient 10s infinite linear",
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

  // If user is logged in, return setup page, otherwise redirect to login page
  if (user !== undefined) {
    return SetupPage();
  }
};

export default ProfileSetup;
