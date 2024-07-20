import React, { useState } from "react";
import { Button, FormControl, Input, Stack, Text, useToast, Container } from "@chakra-ui/react";
import AuthHelper from "../../helpers/AuthHelper";
import { useTranslation } from 'react-i18next';

const VerifyEmail: React.FC = () => {
  const { t } = useTranslation();
  const [token, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await AuthHelper.verifyEmail(token);
    
      if (response && response.status === 200) {
        
      
      } else {
        throw new Error(t("auth.failedToReceiveEmailToken"));
      }
    } catch (error) {
      let errorMessage = t("auth.tokenNotAssociated");
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }

    toast({
        title: t("auth.error"),
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  
  return (
    <>
      <Container variant={"authBox"}>
        <Text fontSize="xl" fontWeight="bold" color="white" mb={4}>
          {t("auth.thankYouForVerifyingEmail")}
        </Text>
      </Container>
    </>
  );
};

export default VerifyEmail;