import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, FormControl, Input, Stack, useToast } from '@chakra-ui/react';
import AuthHelper from '../../helpers/AuthHelper';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();
  const router = useRouter();
  const { token, email } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: "Passwords don't match.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!token || !email) {
      toast({
        title: 'Error',
        description: "Missing token or email in the URL.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await AuthHelper.resetPassword({
        email: email.toString(),
        token: token.toString(),
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Your password has been reset successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        window.location.href = '/login'; // Redirect to login page
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to reset password. Please try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
        </FormControl>
        <FormControl id="confirmPassword">
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
        </FormControl>
        <Button type="submit" colorScheme="blue">Reset Password</Button>
      </Stack>
    </form>
  );
};

export default ResetPassword;