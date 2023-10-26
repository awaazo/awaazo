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
  InputGroup,
  InputLeftAddon,
  Icon,
} from "@chakra-ui/react";
import { useState, FormEvent, useEffect } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Navbar from "../../components/shared/Navbar";
import { UserProfileEditRequest } from "../../utilities/Requests";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import { profile } from "console";
import { UserProfile } from "../../utilities/Interfaces";
import { forEach } from "lodash";
import { Router, useRouter } from "next/router";
const EditProfile: React.FC = () => {
  const router = useRouter()
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [genreColors, setGenreColors] = useState({});
  const [username, setUsername] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File>(null);
  const [formError, setFormError] = useState<string | null>(null);

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

  useEffect(() => {
    UserProfileHelper.profileGetRequest().then((response) => {
      if(response.status == 200){
        const userProfile: UserProfile = response.userProfile;
        setBio(userProfile.bio);
        setInterests(userProfile.interests);
        setSelectedInterests(userProfile.interests);
        setUsername(userProfile.username);
        setTwitterLink(userProfile.twitterUrl);
        setLinkedinLink(userProfile.linkedInUrl);
        setGithubLink(userProfile.gitHubUrl);
        setAvatar(userProfile.avatarUrl);
      
      }
    })
  }, []);

  /**
   * Handles updating the profile when form is submitted
   * @param e FormEvent
   */
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();

    console.log("Update Clicked")

    // Create the request
    const request : UserProfileEditRequest = {
      avatar : avatarFile,
      bio : bio,
      interests : selectedInterests,
      username : username,
      twitterUrl : twitterLink != ""? twitterLink : null,
      linkedInUrl : linkedinLink != ""? linkedinLink : null,
      githubUrl : githubLink != ""? githubLink : null
    }

    // Get the Response
    const response = await UserProfileHelper.profileEditRequest(request);

    // If Profile is saved, return to profile page
    if(response.status === 200){
      router.push('/profile/MyProfile');
    }
    else{
      setFormError(response.message)
    }

  }

  const handleAvatarUpload = (e: FormEvent) => {
    setAvatarFile((e.target as any).files[0])
    setAvatar(URL.createObjectURL((e.target as any).files[0]))  
    e.preventDefault();
  };

    // Add the given functions
  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)]; // Restrict to the first 8 characters for darker colors
    }
    return color;
  };

   const getRandomGradient = () => {
    const color1 = getRandomDarkColor();
    const color2 = getRandomDarkColor();
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  };

    const handleInterestClick = (genre) => {
      console.log(genre)
      console.log(selectedInterests)
      console.log(genreColors)
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
          fontSize: "2rem",
          textAlign: "center",
          marginTop: "1rem",
          fontFamily: "Avenir Next",
        }}
      >
        Edit Profile
      </Text>
      {/* // username here*/}
      <Text>
        @username
      </Text>

      <form onSubmit={handleProfileUpdate}>
        <Stack spacing={6} align={"center"}>

          {/* Avatar Section */}
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
                  backdropFilter: "blur(5px)", 
                  backgroundColor: "rgba(0, 0, 0, 0.4)" 
                }}
                zIndex={-999}
              />
              <input
                type="file"
                id="avatar"
                accept="image/*"

                onChange={(e) => handleAvatarUpload(e)}
                style={{display: "none"}}
              />
            </label>
          </div>
            

          {/* Personal Details Section */}
          {formError && <Text color="red.500">{formError}</Text>}
          <FormControl>
            <Input
              id="username"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "18px",
              }}
            />
          </FormControl>
          <FormControl>
            <Textarea
              id="bio"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "18px",
              }}
              resize="vertical"
            />
          </FormControl>

          {/* Interests Section */}
            <FormControl>
            <FormLabel style={{
                textAlign: "center",
                padding: "10px",
            }}>
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

          {/* Social Links Section */}
          <FormControl>
            <FormLabel>Social Links</FormLabel>
            <InputGroup>
              <InputLeftAddon 
              children={<Icon as={FaTwitter} boxSize={4} />}
              />
              <Input
                type="url"
                placeholder="Twitter URL"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                borderRadius={"full"}
              />
            </InputGroup>
            <InputGroup mt={3}>
              <InputLeftAddon 
              children={<Icon as={FaLinkedin} boxSize={4} />}
              />
              <Input
                type="url"
                placeholder="LinkedIn URL"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
                borderRadius={"full"}
              />
            </InputGroup>
            <InputGroup mt={3}>
              <InputLeftAddon 
              children={<Icon as={FaGithub} boxSize={4} />}
              />
              <Input
                type="url"
                placeholder="GitHub URL"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                borderRadius={"full"}
              />
            </InputGroup>
          </FormControl>

          {/* Update Profile Button */}
          <Button
            type="submit"
            fontSize="md"
            borderRadius={"full"}
            minWidth={"200px"}
            color={"white"}
            marginTop={"15px"}
            marginBottom={"10px"}
            padding={"20px"}
            outline={"1px solid rgba(255, 255, 255, 0.6)"}
            style={{
              background: 'linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)',
              backgroundSize: '300% 300%',
              animation: 'Gradient 10s infinite linear'
            }}
          >
            Update Profile
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

export default EditProfile;

