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

const SignUp: React.FC = () => {
  const profilePage = "/profile/MyProfile";

  const [email, setEmail] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [confirmPassword, setConfirmPassword] = useState<string | null>("");
  const [dateOfBirth, setDateOfBirth] = useState<string | null>("");
  const [signUpError, setSignUpError] = useState<string | null>(""); // To store login error
  const router = useRouter();
  const { data: session } = useSession();
  const [googleSignUpClicked, setGoogleSignUpClicked] = useState(false);

  useEffect(() => {
  }, [session, googleSignUpClicked]);

  const handleGoogleSignUp = async () => {
    setGoogleSignUpClicked(true);
    signIn("google");
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
    }
    // Register with Backend
    else {
      const response = await AuthHelper.register(
        email,
        password,
        username,
        dateOfBirth
      );
      console.log(response);
      // If registration was successful, redirect to profile page. Otherwise, display error.
      if (response) {
        window.location.href = profilePage;
      } 
      else {
        setSignUpError("Registration failed.");
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
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
