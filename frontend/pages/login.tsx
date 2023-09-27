// src/Login.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import logo from "../styles/images/logo.png";
   import Image from 'next/image';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
  };

  return (
    <>
    <Box
      p={6}
      display="flex" // Use flexbox to center vertically
      flexDirection="column" // Stack children vertically
      justifyContent="center" // Center vertically
      alignItems="center" // Center horizontally
      height="80vh"
    >
      <img src={logo.src} alt="logo" 
      style={{
        maxWidth: '20em',
      }} 
      />
      <Text style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '1rem',
      }}>Welcome Back</Text>
      <Text style={{
        fontSize: '1.3rem',
        textAlign: 'center',
        marginBottom: '3rem',
      }}>Sign in to continue</Text>
      <Button
            type="submit"
            colorScheme="green"
            size="lg"
            fontSize="md"
            onClick={() => window.location.href = '/api/auth/google'}
            marginBottom={5}
          >
            Sign in with Google
      </Button>
      <Text style={{
        fontSize: '1.3rem',
        textAlign: 'center',
        marginBottom: '1rem',
      }}>or</Text>
      
      <form onSubmit={handleLogin}>
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

          <Button
            type="submit"
            colorScheme="gray"
            size="lg"
            fontSize="md"
          >
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
    </>
  );
};

export default Login;
