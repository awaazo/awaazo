import React, { useState, FormEvent, useEffect } from "react";
import { Box, Button, Input, Stack, Text, Flex, ButtonGroup, Img, InputGroup, InputRightElement, FormControl, IconButton, Alert, AlertDescription } from "@chakra-ui/react";
import Logo from "../../public/logo_white.svg";
import AuthHelper from "../../helpers/AuthHelper";
import { LoginRequest } from "../../utilities/Requests";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Login from "../../components/auth/Login";

const LoginPage: React.FC = () => {
  const mainPage = "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status == 200) {
        window.location.href = mainPage;
      }
    });
  }, []);

  return (
    <Flex minHeight="100vh" align="center" justify="center">
      <Box
        p={6}
        bg={"rgba(0, 0, 0, 0.3)"}
        border="3px solid rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(10px)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
        borderRadius="3xl"
        maxW="400px"
        w="full"
        textAlign="center"
      >
        <Flex justifyContent="center" mb={4}>
          <Img src={Logo.src} alt="logo" style={{ maxWidth: "40px" }} />
        </Flex>
        <Text fontSize="lg" fontWeight="bold" color="white" mb={1} align={"left"} textColor={"brand.100"}>
          Login to Awaazo
        </Text>
        <Text fontSize="sm" color="gray.400" mb={6} align={"left"}>
          Rediscover Awaazo: Your gateway to an extraordinary, AI-enhanced podcast universe!
        </Text>
        <Login isOpen={null} onClose={null} />
      </Box>
    </Flex>
  );
};

export default LoginPage;