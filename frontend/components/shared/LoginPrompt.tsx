import React, { useState, useEffect } from "react";
import AuthHelper from "../../helpers/AuthHelper";
import Login from "../auth/Login";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";
interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
  infoMessage?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, returnUrl, infoMessage }) => {
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status === 200) {
        window.location.href = "/";
      }
    });
  }, []);

  useEffect(() => {
    if (loginSuccessful) {
      onClose();
    }
  }, [loginSuccessful, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent bg={"rgba(0, 0, 0, 0.3)"} border="3px solid rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)" borderRadius="3xl" maxW="400px" textAlign="center">
        <ModalBody>
          <Login isOpen={isOpen} onClose={onClose} returnUrl={returnUrl} infoMessage={infoMessage} />
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

export default LoginPrompt;
