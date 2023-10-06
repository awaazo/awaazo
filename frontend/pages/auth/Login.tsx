// src/Login.tsx
import React, { useState, FormEvent } from "react";
import { Box, Button, FormControl, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import logo from "../styles/images/logo.png";
import { login } from "../api/api";
import Image from "next/image";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null); // To store login error

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await login({ email, password });
      if (response.status === 200) {
        console.log(response.data);
        window.location.href = "/"; // Redirect to index.tsx
      } else {
        setLoginError(response.data.message || "Failed to log in"); // Display login error
      }
    } catch (error) {
      console.error("An error occurred", error);
      setLoginError("An error occurred while trying to log in."); // Display login error
    }
  };

  return (
    <>
      <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <Box
          p={6}
          display="flex" // Use flexbox to center vertically
          flexDirection="column" // Stack children vertically
          justifyContent="center" // Center vertically
          alignItems="center" // Center horizontally
          height="80vh"
        >
          <img
            src={logo.src}
            alt="logo"
            style={{
              maxWidth: "20em",
            }}
          />
          <Text
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Sign in to continue
          </Text>
          <Button type="submit" colorScheme="green" size="lg" fontSize="md" onClick={() => (window.location.href = "/api/auth/google")} marginBottom={5}>
            Sign in with Google
          </Button>
          <Text
            style={{
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            or
          </Text>
          {loginError && <Text color="red.500">{loginError}</Text>}
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </FormControl>

              <Button type="submit" colorScheme="gray" size="lg" fontSize="md">
                Login
              </Button>
              <Text>
                Don&apos;t have an account?{" "}
                <a href="/signup" style={{ color: "#3182CE" }}>
                  Sign up
                </a>
              </Text>
            </Stack>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
