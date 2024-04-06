import React, { useState } from "react";
import { Button, FormControl, Input, Stack, Text, useToast, Container } from "@chakra-ui/react";
import AuthHelper from "../../helpers/AuthHelper";

const VerifyEmail: React.FC = () => {
  const [token, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await AuthHelper.verifyEmail(token);
    
      if (response && response.status === 200) {
        
      
      } else {
        throw new Error("Failed to receive email token");
      }
    } catch (error) {
      let errorMessage = "The token is not associated to a user.";
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }

    toast({
        title: "Error",
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
          Thank you for verifying your email!
        </Text>
      </Container>
    </>
  );
};

export default VerifyEmail;