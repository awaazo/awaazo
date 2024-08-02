import React, { useState } from 'react'
import { Button, FormControl, Input, Stack, Text, useToast, Container, Img, VStack } from '@chakra-ui/react'
import Logo from '../../public/logos/logo_white.svg'

import AuthHelper from '../../helpers/AuthHelper'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const toast = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await AuthHelper.forgotPassword(email)

      if (response && response.status === 200) {
        const message = response.data || "We've sent a password reset link to your email address."
        toast({
          title: 'Reset Link Sent',
          description: message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      } else {
        throw new Error('Failed to send reset link.')
      }
    } catch (error) {
      let errorMessage = 'The email is not associated to a user.'
      if (error.response) {
        errorMessage = error.response.data || errorMessage
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Container padding={'30px'} display="inline-flex" flexDirection="column" alignItems="center" gap="30px" border-radius="20px">
        <Img src={Logo.src} alt="logo" style={{ maxWidth: '45px' }} />
        <VStack display="flex" flex-direction="column" align-items="center" spacing={1} >
          <VStack align="flex-start" gap="8px" width={'323px'} flexDirection="column" mb={"16px"}>
            <Text fontSize="xl" fontWeight="bold" color="white" textAlign="left">
              Forgot password?
            </Text>
            <Text fontSize="xs" color="az.greyish"  textAlign="left">
              Don’t worry! It happens. Please enter the email associated with your account.
            </Text>
          </VStack>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={4}>
              <FormControl id="email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  required
                />
              </FormControl>
              <Button variant="large" type="submit"  >
                Send Reset Link
              </Button>
            </Stack>
          </form>
        </VStack>
      </Container>
    </>
  )
}

export default ForgotPassword
