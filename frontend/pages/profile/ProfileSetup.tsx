import React, { useState, FormEvent, useEffect, useCallback } from "react";
import { Box, Img, Textarea, Button, FormControl, FormLabel, Input, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AuthHelper from "../../helpers/AuthHelper";
import LogoWhite from "../../public/logo_white.svg";
import { UserProfileSetupRequest } from "../../types/Requests";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { UserMenuInfo } from "../../types/Interfaces";
import ImageAdder from "../../components/tools/ImageAdder";
import GenreSelector from "../../components/tools/GenreSelector";
import withAuth from "../../utilities/AuthHOC";

const ProfileSetup: React.FC = () => {
  const mainPage = "/";
  const loginPage = "/auth/Login";

  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [displayName, setDisplayName] = useState("");
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState<number>(0);
  const [bio, setBio] = useState("");
  const [bioCharacterCount, setBioCharacterCount] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [setupError, setSetupError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      if (res.status == 200) {
        setUser(res.userMenuInfo);
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

  const handleImageAdded = useCallback(async (addedImageUrl: string) => {
    try {
      const response = await fetch(addedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "avatar.jpg", { type: blob.type });
      setAvatarFile(file);
    } catch (error) {
      console.error("Error converting image URL to File:", error);
    }
  }, []);

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

  const handleInterestClick = (selectedGenres: string[]) => {
    // Update the 'tags' state with the new set of selected genres
    setSelectedInterests(selectedGenres);
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
        <Img src={LogoWhite.src} alt="logo" maxHeight="10em" maxWidth="3em" />
        <Text fontSize="1.5rem" textAlign="center" marginTop="1rem">
          Hey, @{user.username}! Let's get you set up.
        </Text>

        <form onSubmit={handleSetup}>
          <Stack spacing={6} align={"center"}>
            <Box mt={4}>
              <ImageAdder onImageAdded={handleImageAdded} />
            </Box>
            {setupError && <Text color="red.500">{setupError}</Text>}

            <FormControl position="relative">
              <Input id="displayName" placeholder="Display Name" value={displayName} onChange={handleDisplayNameChange} alignSelf = "center" />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {displayNameCharacterCount}/25
              </Text>
            </FormControl>

            <FormControl position="relative">
              <Textarea id="bio" placeholder="What's your story?" value={bio} onChange={handleBioChange} width="100%" height="100px" padding="12px" fontSize="16px" borderRadius="18px" resize="vertical" />
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
              <GenreSelector onGenresChange={handleInterestClick} />
            </FormControl>
            <Button id="setupBtn" type="submit" variant="gradient">
              Start Listening
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );

  if (user !== undefined) {
    return SetupPage();
  }
};

export default withAuth(ProfileSetup);
