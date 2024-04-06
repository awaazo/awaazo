import React, { useState, FormEvent, useEffect } from 'react'
import { Box, Button, Input, Stack, Text, Flex, ButtonGroup, Img, InputGroup, InputRightElement, FormControl, IconButton, Alert, AlertDescription, Container } from '@chakra-ui/react'
import AuthHelper from '../../helpers/AuthHelper'
import { LoginRequest } from '../../types/Requests'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Logo from '../../public/logos/logo_white.svg'
import { az } from 'date-fns/locale'

interface LoginProps {
  infoMessage?: string
}

const Login: React.FC<LoginProps> = ({ infoMessage = 'Get into the new age of podcasting.' }) => {
  const mainPage = '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccessful, setLoginSuccessful] = useState(false)

  useEffect(() => {
    AuthHelper.authMeRequest().then((res) => {
      if (res.status === 200) {
        window.location.href = mainPage
      }
    })
  }, [])

  const handlePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    console.log('Login Clicked')
    const loginRequest: LoginRequest = {
      email: email,
      password: password,
    }

    const response = await AuthHelper.authLoginRequest(loginRequest)
    if (response.status === 200) {
      AuthHelper.authMeRequest().then((res) => {
        if (res.status === 200) {
          if (window) window.sessionStorage.setItem('userInfo', JSON.stringify(res.userMenuInfo))
        }
      })

      // Set loginSuccessful to true
      setLoginSuccessful(true)
      window.location.href = mainPage
    } else {
      setLoginError(response.data)
    }
  }

  return (
    <>
      <Container variant={'authBox'} bg="az.blackish">
        {loginError && (
          <Alert status="error" borderRadius="xl" mb={4} p={2}>
            <AlertDescription display="block" fontSize="sm">
              {loginError}
            </AlertDescription>
          </Alert>
        )}
        <Flex justifyContent="center" mb={4}>
          <Img src={Logo.src} alt="logo" style={{ maxWidth: '45px' }} />
        </Flex>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <Input
              type="text"
              id="email"
              placeholder="Enter Email/Username"
              borderRadius="2xl"
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.400"
              _placeholder={{ color: 'whiteAlpha.700' }}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl>
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
          
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputRightElement>
                  <IconButton
                    bg="transparent"
                    variant="minimal"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={handlePasswordVisibility}
               
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button id="loginBtn" type="submit" variant={'large'}>
              Log in
            </Button>

            <Button
              w="100%"
              leftIcon={<FcGoogle style={{ width: '25px', height: '25px' }} />}
              onClick={() => signIn('google')}
              color="az.greyish"
              bg="az.lightGradient"
              fontSize="md"
              mb={3}
              borderRadius="15px"
              h="50px"
              _hover={{
                bg: 'az.green',
                color: 'white',
                transition: 'all 0.5s ease-in-out',
              }}
            >
              Continue with Google
            </Button>
          </Stack>

          <Text color="az.greyish" fontSize="sm" align={'center'} mb={1}>
             Don't have an account?  {""}
           
            <Box
              as="a"
              href="/auth/Signup"
              color="white"
              fontWeight="semibold"
              _hover={{
                color: 'az.red',
                transition: 'color 0.5s ease-in-out',
              }}
            >
              Sign up
            </Box>
          </Text>
          <Text color="az.blue" fontSize="sm" mb={1} align={'center'}>
            <Box
              as="a"
              href="/auth/ForgotPassword"
              color={'az.blue'}
              fontWeight="semibold"
              _hover={{
                color: 'az.red',
                transition: 'color 0.5s ease-in-out',
              }}
            >
              Forgot password ?
            </Box>
          </Text>
        </form>
      </Container>
    </>
  )
}

export default Login
