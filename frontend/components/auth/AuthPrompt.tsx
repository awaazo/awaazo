import React, { useEffect } from "react";
import AuthHelper from "../../helpers/AuthHelper";
import Login from "./Login";
import { Modal, ModalContent, ModalCloseButton, ModalOverlay } from "@chakra-ui/react";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  infoMessage?: string;
}

const AuthPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, infoMessage }) => {
  
  useEffect(() => {
    let isMounted = true;
    AuthHelper.authMeRequest().then((res) => {
      if (isMounted && res.status === 200) {
        onClose(); 
      }
    });
    return () => {
      isMounted = false;
    };
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent  boxShadow={"none"}>
        <Login infoMessage={infoMessage} />
        <ModalCloseButton position="absolute" right="40px" top="40px" />
      </ModalContent>
    </Modal>
  );
};

export default AuthPrompt;
