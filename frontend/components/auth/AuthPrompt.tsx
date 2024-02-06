import React, { useState, useEffect } from "react";
import AuthHelper from "../../helpers/AuthHelper";
import Login from "./Login";
import { Modal,  ModalContent,  ModalCloseButton } from "@chakra-ui/react";
interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  infoMessage?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, infoMessage }) => {
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
    <Modal isOpen={isOpen} onClose={onClose}  variant={"minimal"} > 
     
      <ModalContent>
          <Login />
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

export default LoginPrompt;
