import React, { useState, FormEvent, useEffect } from "react";
import { Box, Button, Input, Stack, Text, Flex, ButtonGroup, Img, InputGroup, InputRightElement, FormControl, IconButton, Alert, AlertDescription } from "@chakra-ui/react";
import AuthHelper from "../../helpers/AuthHelper";
import { LoginRequest } from "../../types/Requests";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Logo from "../../public/logo_white.svg";



const Login: React.FC = () => {
  const mainPage = "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status === 200) {
        window.location.href = mainPage;
      }
    });
  }, []);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Login Clicked");
    const loginRequest: LoginRequest = {
      email: email,
      password: password,
    };

    const response = await AuthHelper.authLoginRequest(loginRequest);
    if (response.status === 200) {
      AuthHelper.authMeRequest().then((res) => {
        if (res.status === 200) {
          if (window) window.sessionStorage.setItem("userInfo", JSON.stringify(res.userMenuInfo));
        }
      });

      // Set loginSuccessful to true
      setLoginSuccessful(true);
      window.location.href = mainPage;
    } else {
      setLoginError(response.data);
    }
  };


  return (
    <>
      <Flex minHeight="100vh" align="center" justify="center">
        <Box p={6} bg={"rgba(0, 0, 0, 0.3)"} border="3px solid rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)" borderRadius="3xl" maxW="400px" w="full" textAlign="center">
          {loginError && (
            <Alert status="error" borderRadius="xl" mb={4} p={2}>
              <AlertDescription display="block" fontSize="sm">
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          <Flex justifyContent="center" mb={4}>
            <Img src={Logo.src} alt="logo" style={{ maxWidth: "40px" }} />
          </Flex>
          <Text fontSize="lg" fontWeight="bold" color="white" mb={1} align={"left"} textColor={"brand.100"}>
            Login to Awaazo
          </Text>
          <Text fontSize="sm" color="gray.400" mb={6} align={"left"}>
            Rediscover Awaazo: Your gateway to an extraordinary, AI-enhanced podcast universe!
          </Text>
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <Input type="text" id="email" placeholder="Email or username" borderRadius="2xl" bg="whiteAlpha.200" borderColor="whiteAlpha.400" _placeholder={{ color: "whiteAlpha.700" }} required onChange={(e) => setEmail(e.target.value)} />
              <FormControl>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    borderRadius="2xl"
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.400"
                    _placeholder={{ color: "whiteAlpha.700" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <InputRightElement>
                    <IconButton bg="transparent" variant="ghost" aria-label={showPassword ? "Hide password" : "Show password"} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={handlePasswordVisibility} borderRadius="3xl" />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button id="loginBtn" type="submit" color="white" bg="brand.100" size="md" fontSize="md" borderRadius="2xl" py={3} boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)">
                Log in
              </Button>
            </Stack>
            <Flex alignItems="center" justifyContent="center" mb={4} mt={4}>
              <Box flex="1" height="1px" bg="whiteAlpha.400" />
              <Text fontSize="sm" mx={2} color="gray.500">
                Or authorize with
              </Text>
              <Box flex="1" height="1px" bg="whiteAlpha.400" />
            </Flex>
            <ButtonGroup isAttached mb={4}>
              <Button leftIcon={<FaGoogle />} onClick={() => signIn("google")} size="md" mb={3} borderRadius="2xl">
                Google
              </Button>
            </ButtonGroup>

            <Text color="gray.400" fontSize="sm" mb={1} align={"left"}>
              <Box as="a" href="/auth/ForgotPassword" mb={1}>
                Forgot password?
              </Box>
            </Text>
            <Text color="gray.400" fontSize="sm" align={"left"}>
              Don't have an account?{" "}
              <Box as="a" href="/auth/Signup" color="brand.100" fontWeight="semibold">
                Sign up
              </Box>
            </Text>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
