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

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null); // To store login error

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(password === confirmPassword)) {
      setSignUpError("The passwords you have entered do not match");
    } else {
      try {
        const payload = {
          email: email || undefined,
          password: password || undefined,
          dateOfBirth: dateOfBirth || undefined,
        };
        console.log("Payload:", payload); // Debugging line
        const response = await register(payload);
        console.log("Response:", response); // Debugging line
        if (response.status === 200) {
          console.log(response.data);
          window.location.href = "/auth/Login";
        } else {
          alert(response.data.message || "Failed to sign up");
        }
      } catch (error) {
        if (error.response) {
          console.error("Server Response:", error.response.data);
        }
        console.error("An error occurred:", error);
        setSignUpError(error.response.data);
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
      height="80vh"
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
      <Button type="button" colorScheme="green" size="lg" fontSize="md" onClick={() => signIn("google")} marginBottom={5} p={6}>
        Sign up with Google
      </Button>
      <Text fontSize="1.3rem" textAlign="center" marginBottom="1rem">
        or
      </Text>
      <form onSubmit={handleSignUp}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              placeholder="Enter your date of birth"
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
          <Text
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            or
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