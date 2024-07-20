import React, { useState } from 'react'
import { Box, Container, Button, FormControl, FormLabel, Input, Stack, Text, Flex, Img, Alert, AlertDescription } from '@chakra-ui/react'
import Logo from '../../public/logos/logo_white.svg'
import { signIn } from 'next-auth/react'
import AuthHelper from '../../helpers/AuthHelper'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { RegisterRequest } from '../../types/Requests'
import { FcGoogle } from 'react-icons/fc'
import { isEmail } from 'validator'
import { useTranslation } from 'react-i18next'

const SignUp: React.FC = () => {
  const { t } = useTranslation()
  const setupPage = '/profile/ProfileSetup'
  const [email, setEmail] = useState<string | null>('')
  const [username, setUsername] = useState<string | null>('')
  const [usernameCharacterCount, setUsernameCharacterCount] = useState<number>(0)
  const [password, setPassword] = useState<string | null>('')
  const [confirmPassword, setConfirmPassword] = useState<string | null>('')
  const [dateOfBirth, setDateOfBirth] = useState<string | null>('')
  const [signUpError, setSignUpError] = useState<string | null>('')
  const { data: session } = useSession()
  const [googleSignUpClicked, setGoogleSignUpClicked] = useState(false)

  useEffect(() => {}, [session, googleSignUpClicked])

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  const age = calculateAge(dateOfBirth)

  const handleGoogleSignUp = async () => {
    setGoogleSignUpClicked(true)
    signIn('google')
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.slice(0, 25)
    setUsername(newUsername)
    setUsernameCharacterCount(newUsername.length)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError(null)

    if (!email || !isEmail(email)) {
      setSignUpError(t('auth.invalidEmail'))
      return
    }
    if (!password || password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setSignUpError(t('auth.invalidPassword'))
      return
    }
    if (!username || !/^[A-Za-z0-9_]+$/.test(username)) {
      setSignUpError(t('auth.invalidUsername'))
      return
    }
    if (password !== confirmPassword) {
      setSignUpError(t('auth.passwordsDontMatch'))
      return
    }

    if (age < 8) {
      setSignUpError(t('auth.tooYoung'))
      return
    }
    if (age > 100) {
      setSignUpError(t('auth.tooOld'))
      return
    }

    const registerRequest: RegisterRequest = {
      email: email,
      password: password,
      username: username,
      dateOfBirth: dateOfBirth,
      gender: 'None',
    }

    try {
      const response = await AuthHelper.authRegisterRequest(registerRequest)
      if (response.status === 200) {
        window.location.href = setupPage
      } else {
        if (response.data.search('SMTP') !== -1) {
          window.location.href = setupPage
        }
        setSignUpError(response.data)
      }
    } catch (error) {
      setSignUpError(t('auth.signUpError'))
    }
  }

  return (
    <>
      <Container variant={'authBox'} bg="az.blackish" style={{ outline: 'none', fontFamily: "'Neue Montreal'" }}>
        <Flex justifyContent="center" mb={4}>
          <Img src={Logo.src} alt="logo" style={{ maxWidth: '45px' }} />
        </Flex>

        {signUpError && (
          <Alert status="error" borderRadius="xl" mb={4} p={2}>
            <Box flex="1">
              <AlertDescription display="block" fontSize="sm">
                {signUpError}
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <form onSubmit={handleSignUp}>
          <Stack spacing={3}>
            <FormControl>
              <Input type="text" id="username" placeholder={t('auth.enterUsername')} value={username} onChange={handleUsernameChange} required borderRadius="2xl" pr="50px" />
              <Text position="absolute" right="9px" bottom="9px" fontSize="sm" color="grey">
                {usernameCharacterCount}/25
              </Text>
            </FormControl>
            <FormControl>
              <Input type="email" id="email" placeholder={t('auth.enterEmail')} value={email} onChange={(e) => setEmail(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl>
              <Input type="password" id="password" placeholder={t('auth.enterPassword')} value={password} onChange={(e) => setPassword(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl>
              <Input type="password" id="confirmPassword" placeholder={t('auth.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required borderRadius="2xl" />
            </FormControl>
            <FormControl mt={2} mb={2}>
              <FormLabel htmlFor="date" fontWeight="normal" fontSize="sm" ml={2}>
                {t('auth.dateOfBirth')}
              </FormLabel>

              <Input type="date" id="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required borderRadius="2xl" />
            </FormControl>

            <Button id="loginBtn" type="submit" variant={"large"}>
              {t('auth.signUp')}
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
              {t('auth.continueWithGoogle')}
            </Button>

            <Text color="gray.400" fontSize="sm" align={'center'}>
              {t('auth.alreadyHaveAccount')}{' '}
              <Box as="a" href="/auth/Login" color="white" fontWeight="semibold"  _hover={{
                color: 'az.red',
                transition: 'color 0.5s ease-in-out',
              }}>
                {t('auth.login')}
              </Box>
            </Text>
          </Stack>
        </form>
      </Container>
    </>
  )
}

export default SignUp
