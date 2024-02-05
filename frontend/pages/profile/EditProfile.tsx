import { Box, Textarea, Center, Heading, Button, Img, FormControl, FormLabel, Input, Stack, Text, IconButton, InputGroup, InputLeftAddon, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, VStack } from "@chakra-ui/react";
import { useState, FormEvent, useEffect } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { UserProfileEditRequest } from "../../utilities/Requests";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { UserProfile } from "../../utilities/Interfaces";
import { useRouter } from "next/router";
import ChangePassWordForm from "../../components/profile/MyProfile/ChangePasswordForm";
import GenreSelector from "../../components/tools/GenreSelector";
import { FaKey } from 'react-icons/fa';

const EditProfile = () => {
  const [bio, setBio] = useState("");
  const [bioCharacterCount, setBioCharacterCount] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [username, setUsername] = useState("");
  const [usernameCharacterCount, setUsernameCharacterCount] = useState<number>(0);
  const [displayName, setDisplayName] = useState("");
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState<number>(0);
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isModalChangePasswordOpen, setIsModelChangePasswordOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Get the user profile
    UserProfileHelper.profileGetRequest().then((response) => {
      if (response.status == 200) {
        setUserProfile(response.userProfile);
        setUsername(response.userProfile.username);
        setUsernameCharacterCount(response.userProfile.username.length);
        setDisplayName(response.userProfile.displayName);
        setDisplayNameCharacterCount(response.userProfile.displayName.length);
        setBio(response.userProfile.bio);
        setBioCharacterCount(response.userProfile.bio.length);
        setTwitterLink(response.userProfile.twitterUrl);
        setLinkedinLink(response.userProfile.linkedInUrl);
        setGithubLink(response.userProfile.githubUrl);
        setWebsiteUrl(response.userProfile.websiteUrl);
        setAvatar(response.userProfile.avatarUrl);
      } else {
        router.replace("/auth/Login");
      }
    });
  }, [router]);

  /**
   * Handles updating the profile when form is submitted
   * @param e FormEvent
   */
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();

    console.log("Update Clicked");

    // Create the request
    const request: UserProfileEditRequest = {
      avatar: avatarFile,
      bio: bio,
      interests: selectedInterests,
      username: username,
      displayName: displayName,
      twitterUrl: twitterLink != "" ? twitterLink : null,
      linkedInUrl: linkedinLink != "" ? linkedinLink : null,
      githubUrl: githubLink != "" ? githubLink : null,
      websiteUrl: websiteUrl != "" ? websiteUrl : null,
    };

    // Get the Response
    const response = await UserProfileHelper.profileEditRequest(request);

    // If Profile is saved, return to profile page
    if (response.status === 200) {
      router.push("/profile/MyProfile");
    } else {
      setFormError(response.message);
    }
  };

  // Ensures username is not longer than 25 characters
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.slice(0, 25);
    setUsername(newUsername);
    setUsernameCharacterCount(newUsername.length);
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

  const openChangePasswordModal = () => {
    setIsModelChangePasswordOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsModelChangePasswordOpen(false);
  };

  const handleSelectedInterests = (selectedGenres: string[]) => {
    setSelectedInterests(selectedGenres);
  };

  return (
    <>
      <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Heading fontWeight={"normal"}>Edit Profile</Heading>
        {/* <Text>@{userProfile.username}</Text> */}

        <form onSubmit={handleProfileUpdate}>
          <Stack spacing={6} align={"center"}>
            {/* Avatar Section */}
            <Center>
              <Img src={avatar || "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png"} alt="Avatar" width="150px" height="150px" borderRadius="50%" padding="15px" position="relative" />
            </Center>

            {/* Personal Details Section */}
            {formError && <Text color="red.500">{formError}</Text>}
            <FormControl position="relative">
              <FormLabel>Username</FormLabel>
              <Input type="text" id="username" placeholder="Enter your username" value={username} onChange={handleUsernameChange} required pr="50px" />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {usernameCharacterCount}/25
              </Text>
            </FormControl>

            <FormControl position="relative">
              <FormLabel>Display name</FormLabel>
              <Input id="displayName" placeholder="Display Name" value={displayName} onChange={handleDisplayNameChange} style={{ alignSelf: "center" }} />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {displayNameCharacterCount}/25
              </Text>
            </FormControl>
            <FormControl position="relative">
              <FormLabel>Bio</FormLabel>
              <Textarea id="bio" placeholder="What's your story? (Optional)" value={bio} onChange={handleBioChange} />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {bioCharacterCount}/250
              </Text>
            </FormControl>

            {/* Change Password Button */}
            <Button  onClick={openChangePasswordModal} size="md" marginRight="auto" leftIcon={<Icon as={FaKey} boxSize={4} />} borderRadius="xl" >
              Change Password
            </Button>


               {/* Socials Section */}
            <FormControl>
              <FormLabel>Social Links</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<Icon as={FaTwitter} boxSize={4} />} />
                <Input type="url" placeholder="Twitter URL" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} borderRadius={"full"} />
              </InputGroup>
              <InputGroup mt={3}>
                <InputLeftAddon children={<Icon as={FaLinkedin} boxSize={4} />} />
                <Input type="url" placeholder="LinkedIn URL" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} borderRadius={"full"} />
              </InputGroup>
              <InputGroup mt={3}>
                <InputLeftAddon children={<Icon as={FaGithub} boxSize={4} />} />
                <Input type="url" placeholder="GitHub URL" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} borderRadius={"full"} />
              </InputGroup>
            </FormControl>

            {/* Interests Section */}
            <FormControl>
              <FormLabel textAlign="center" padding="10px">
                What kind of topics do you like?
              </FormLabel>
              <GenreSelector onGenresChange={handleSelectedInterests} />
            </FormControl>

            {/* Update Profile Button */}
            <Button type="submit" variant="gradient" marginBottom={"150px"}>
              Update Profile
            </Button>
          </Stack>
        </form>
      </Box>

      <Modal isOpen={isModalChangePasswordOpen} onClose={closeChangePasswordModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack spacing={5} align="center" backgroundColor={"transparent"}>
                <ChangePassWordForm />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProfile;
