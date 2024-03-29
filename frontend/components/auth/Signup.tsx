import React, { useState } from "react";
import { Box, Container, Button, FormControl, FormLabel, Input, Stack, Text, Flex, ButtonGroup, Img, Alert, AlertDescription } from "@chakra-ui/react";
import Logo from "../../public/logo_white.svg";
import { signIn } from "next-auth/react";
import AuthHelper from "../../helpers/AuthHelper";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { RegisterRequest } from "../../types/Requests";
import { FaGoogle } from "react-icons/fa";
import { isEmail } from "validator";

const SignUp: React.FC = () => {
  const setupPage = "/profile/ProfileSetup";
  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [usernameCharacterCount, setUsernameCharacterCount] = useState<number>(0);
  const [password, setPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [dateOfBirth, setDateOfBirth] = useState<string | null>("");
  const [signUpError, setSignUpError] = useState<string | null>("");
  const { data: session } = useSession();
  const [googleSignUpClicked, setGoogleSignUpClicked] = useState(false);

  useEffect(() => {}, [session, googleSignUpClicked]);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const age = calculateAge(dateOfBirth);

  const handleGoogleSignUp = async () => {
    setGoogleSignUpClicked(true);
    signIn("google");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.slice(0, 25);
    setUsername(newUsername);
    setUsernameCharacterCount(newUsername.length);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!email || !isEmail(email)) {
      setSignUpError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setSignUpError("Password must be at least 8 characters long and include both letters and numbers.");
      return;
    }
    if (!username || !/^[A-Za-z0-9_]+$/.test(username)) {
      setSignUpError("Username can only contain letters, numbers, and underscores.");
      return;
    }
    if (password !== confirmPassword) {
      setSignUpError("Passwords do not match.");
      return;
    }

    if (age < 8) {
      setSignUpError("You're too young to be on Awaazo, come back in a couple of years!");
      return;
    }
    if (age > 100) {
      setSignUpError("Centenarian? Impressive! But Awaazo is for the young at heart.");
      return;
    }

    const registerRequest: RegisterRequest = {
      email: email,
      password: password,
      username: username,
      dateOfBirth: dateOfBirth,
      gender: "None",
      
    };

    try {
      const response = await AuthHelper.authRegisterRequest(registerRequest);
      if (response.status === 200) {
        window.location.href = setupPage;
      } else {
        setSignUpError(response.data);
      }
    } catch (error) {
      setSignUpError("An error occurred during sign up.");
    }
  };

  return (
    <>
      <Container variant={"authBox"}>
        <Flex justifyContent="center" mb={4}>
          <Img src={Logo.src} alt="logo" style={{ maxWidth: "40px" }} />
        </Flex>
        <Text fontSize="lg" fontWeight="bold" color="white" align={"center"} textColor={"brand.300"}>
          Sign Up to Awaazo
        </Text>
        <Text fontSize="sm" color="gray.400" mb={6} align={"center"}>
          Join Awaazo and transform podcasting.
        </Text>

        {signUpError && (
          <Alert status="error" borderRadius="xl" mb={4} p={2}>
            <Box flex="1">
              <AlertDescription display="block" fontSize="sm">
                {signUpError}
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <form onSubmit={handleSignUp}>
          <Stack spacing={3}>
            <FormControl>
              <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl>
              <Input type="text" id="username" placeholder="Username" value={username} onChange={handleUsernameChange} required borderRadius="2xl" pr="50px" />
              <Text position="absolute" right="9px" bottom="9px" fontSize="sm" color="gray.500">
                {usernameCharacterCount}/25
              </Text>
            </FormControl>
            <FormControl>
              <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl>
              <Input type="password" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl mt={2} mb={2}>
              <FormLabel htmlFor="date" fontWeight="normal" fontSize="sm" ml={2}>
                Date of Birth
              </FormLabel>
              <Input type="date" id="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required borderRadius="2xl" />
            </FormControl>

            <Button id="loginBtn" type="submit" color="white" bg="brand.100" size="md" fontSize="md" borderRadius="2xl" py={3} boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)">
              Sign Up
            </Button>

            <Flex alignItems="center" justifyContent="center">
              <Box flex="1" height="1px" bg="whiteAlpha.400" />
              <Text fontSize="sm" mx={2} color="gray.500">
                Or authorize with
              </Text>
              <Box flex="1" height="1px" bg="whiteAlpha.400" />
            </Flex>

            <ButtonGroup isAttached justifyContent="center">
              <Button leftIcon={<FaGoogle />} onClick={handleGoogleSignUp} size="md" mb={3} borderRadius="2xl">
                Google
              </Button>
            </ButtonGroup>

            <Text color="gray.400" fontSize="sm" align={"center"}>
              Already have an account?{" "}
              <Box as="a" href="/auth/Login" color="brand.100" fontWeight="semibold">
                Log in
              </Box>
            </Text>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default SignUp;
