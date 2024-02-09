import React, { useState } from "react";
import { Button, FormControl, Input, Stack, Text, useToast, Container } from "@chakra-ui/react";
import AuthHelper from "../../helpers/AuthHelper";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await AuthHelper.forgotPassword(email);
      // Check if the response explicitly indicates success
      if (response && response.status === 200) {
        const message = response.data || "We've sent a password reset link to your email address.";
        toast({
          title: "Reset Link Sent",
          description: message,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        // Handle any other case as a failure to be safe
        throw new Error("Failed to send reset link.");
      }
    } catch (error) {
      console.error(error); // For debugging

      let errorMessage = "The email is not associated to a user.";
      // Handle specific Axios error response
      if (error.response) {
        // Use the server's response message if available
        errorMessage = error.response.data || errorMessage;
      }

      // Show error toast
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
          Forgot your password?
        </Text>
        <Text fontSize="md" color="gray.400" mb={8}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" borderRadius="2xl" bg="whiteAlpha.200" borderColor="whiteAlpha.400" _placeholder={{ color: "whiteAlpha.700" }} required />
            </FormControl>
            <Button type="submit" bg="brand.100" color="white" size="md" fontSize="md" borderRadius="2xl" py={3} width="full" boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)">
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default ForgotPassword;