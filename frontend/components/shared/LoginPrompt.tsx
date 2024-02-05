import React, { useState, FormEvent, useEffect } from "react";
import AuthHelper from "../../helpers/AuthHelper";
import { LoginRequest } from "../../utilities/Requests";
import Logo from "../../public/logo_white.svg";
import Login from "../auth/Login";
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, Flex, Img, ModalBody, ModalFooter, ModalCloseButton } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
  infoMessage?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, returnUrl, infoMessage }) => {
  const mainPage = "/";
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status === 200) {
        window.location.href = mainPage;
      }
    });
  }, []);

  // Close the modal if login was successful
  useEffect(() => {
    if (loginSuccessful) {
      onClose();
    }
  }, [loginSuccessful, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent bg={"rgba(0, 0, 0, 0.3)"} border="3px solid rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)" borderRadius="3xl" maxW="400px" textAlign="center">
        <ModalHeader>
          <Flex justifyContent="center" mb={4}>
            <Img src={Logo.src} alt="logo" style={{ maxWidth: "40px" }} />
          </Flex>
          <Text fontSize="lg" fontWeight="bold" color="white" mb={1} align={"left"} textColor={"brand.100"}>
            Login to Awaazo
          </Text>
          <Text fontSize="sm" color="gray.400" mb={6} align={"left"}>
            Rediscover Awaazo: Your gateway to an extraordinary, AI-enhanced podcast universe!
          </Text>
        </ModalHeader>
        <ModalBody>
          <Login isOpen={isOpen} onClose={onClose} returnUrl={returnUrl} infoMessage={infoMessage} />
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

export default LoginPrompt;
