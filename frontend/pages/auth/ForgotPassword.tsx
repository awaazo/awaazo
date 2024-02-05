import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, Flex, useToast } from "@chakra-ui/react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Reset Link Sent",
      description: "We've sent a password reset link to your email address.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center">
      <Box
        p={6}
        bg={"rgba(0, 0, 0, 0.3)"}
        border="3px solid rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(10px)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
        borderRadius="lg"
        maxW="400px"
        w="full"
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold" color="white" mb={4}>
          Forgot your password?
        </Text>
        <Text fontSize="md" color="gray.400" mb={8}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                borderRadius="2xl"
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.400"
                _placeholder={{ color: "whiteAlpha.700" }}
                required
              />
            </FormControl>
            <Button type="submit" bg="brand.100" color={"black"} size="md" fontSize="md" borderRadius="2xl" py={3} width="full" boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)">
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
