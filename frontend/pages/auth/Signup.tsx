import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { register } from "../api/api";
import LogoWhite from "../../public/logo_white.svg";
import { signIn } from "next-auth/react";
import AuthHelper from "../../helpers/AuthHelper";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { RegisterRequest } from "../../utilities/Requests";

const SignUp: React.FC = () => {
  const setupPage = "/Setup";

  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [usernameCharacterCount, setUsernameCharacterCount] =
    useState<number>(0);
  const [password, setPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [dateOfBirth, setDateOfBirth] = useState<string | null>("");
  const [signUpError, setSignUpError] = useState<string | null>(""); // To store login error
  const router = useRouter();
  const { data: session } = useSession();
  const [googleSignUpClicked, setGoogleSignUpClicked] = useState(false);

  useEffect(() => {}, [session, googleSignUpClicked]);

  const handleGoogleSignUp = async () => {
    setGoogleSignUpClicked(true);
    signIn("google");
  };

  // Ensures username is not longer than 25 characters
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.slice(0, 25);
    setUsername(newUsername);
    setUsernameCharacterCount(newUsername.length);
  };

  /**
   * Handles the SignUp Event.
   * @param e Event from SignUp Form
   */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (!(password === confirmPassword)) {
      setSignUpError("Passwords do not match.");
      console.debug(signUpError);
    } else {
      // Register with Backend
      const registerRequest: RegisterRequest = {
        email: email,
        password: password,
        username: username,
        dateOfBirth: dateOfBirth,
        gender: "None",
      };

      const response = await AuthHelper.authRegisterRequest(registerRequest);

      if (response.status === 200) {
        window.location.href = setupPage;
      } else {
        setSignUpError(response.data);
      }
    }
  };

  return (
    <Box
      p={6}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <img src={LogoWhite.src} alt="logo" style={{ maxWidth: "20em" }} />
      <Text
        fontSize="2.5rem"
        fontWeight="bold"
        textAlign="center"
        marginBottom="1rem"
      >
        Create an Account
      </Text>
      <Text fontSize="1.3rem" textAlign="center" marginBottom="3rem">
        Sign up to get started
      </Text>
      <Button
        type="button"
        colorScheme="green"
        size="lg"
        fontSize="md"
        onClick={handleGoogleSignUp}
        marginBottom={5}
        p={6}
      >
        Sign up with Google
      </Button>
      <Text fontSize="1.3rem" textAlign="center" marginBottom="1rem">
        or
      </Text>
      {signUpError && <Text color="red.500">{signUpError}</Text>}
      <form onSubmit={handleSignUp}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl position="relative">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              required
              pr="50px"
            />
            <Text
              position="absolute"
              right="8px"
              bottom="8px"
              fontSize="sm"
              color="gray.500"
            >
              {usernameCharacterCount}/25
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="date">Date of Birth</FormLabel>
            <Input
              type="date"
              id="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="gray" size="lg" fontSize="md">
            Sign Up
          </Button>
          <Text>
            Already have an account?{" "}
            <a href="/auth/Login" style={{ color: "#3182CE" }}>
              Log in
            </a>
          </Text>
          <div className="sso-group">
            <Stack
              direction="column"
              style={{ alignSelf: "center" }}
              gap={4}
            ></Stack>
          </div>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUp;
