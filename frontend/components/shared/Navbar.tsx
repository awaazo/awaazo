import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { DefaultSession } from 'next-auth'
import { Box, Flex, IconButton, Button, HStack, useBreakpointValue, Spacer } from '@chakra-ui/react'
import { ArrowL, ArrowR } from '../../public/icons'
import AuthHelper from '../../helpers/AuthHelper'
import Notifications from '../notification/Notifications'
import { UserMenuInfo } from '../../types/Interfaces'
import { GoogleSSORequest } from '../../types/Requests'
import NotificationHelper from '../../helpers/NotificationsHelper'


export default function Navbar() {
  const loginPage = '/auth/Login'
  const signupPage = '/auth/Signup'
  const { data: session, status } = useSession()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserMenuInfo | (() => UserMenuInfo)>(() => ({
    id: '',
    username: '',
    avatarUrl: '',
    isAdmin: false, 
  }))
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [isUserSet, setIsUserSet] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  const [navbarStyle, setNavbarStyle] = useState({
    backdropFilter: 'blur(0px)',
    boxShadow: '',
  })

  interface SessionExt extends DefaultSession {
    token: {
      email: string
      sub: string
      id_token: string
      name: string
      picture: string
    }
  }

  useEffect(() => {
    // Custom User logged in
    if (!isUserSet) {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status == 200) {
          setUser(response.userMenuInfo)
          setIsUserLoggedIn(true)
          setIsUserSet(true)
          setIsLoggedIn(true)
        }
      })
    }
    // Google User logged in
    if (session !== null && session !== undefined && !isLoggedIn) {
      // Get the session info
      const currentSession = session as SessionExt
      const googleSSORequest: GoogleSSORequest = {
        email: currentSession.token.email,
        sub: currentSession.token.sub,
        token: currentSession.token.id_token,
        avatar: currentSession.token.picture,
        name: currentSession.token.name,
      }

      AuthHelper.loginGoogleSSO(googleSSORequest).then((response) => {
        if (response.status == 200) {
          if (!isUserSet) {
            AuthHelper.authMeRequest().then((response) => {
              if (response.status == 200) {
                setUser(response.userMenuInfo)
                setIsUserLoggedIn(true)
                setIsUserSet(true)
                setIsLoggedIn(true)
              }
            })
          }
        }
      })
    }
  }, [session, isLoggedIn])

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = 100; 
    if (scrollY === 0) {
  
      setNavbarStyle({
        backdropFilter: 'blur(0px)',
        boxShadow: 'none', 
      });
    } else {
  
      const blurIntensity = Math.min(scrollY / maxScroll, 1) * 20;
      setNavbarStyle({
        backdropFilter: `blur(${blurIntensity}px)`,
        boxShadow: '10px 12px 40px -10px rgba(0, 0, 0, 0.4)',
      });
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const fetchNotificationCount = async () => {
      const response = await NotificationHelper.NotificationCount()
      if (response !== null && response !== undefined && typeof response === 'number') {
        setNotificationCount(response)
      } else {
        console.error('Failed to fetch notification count:', response.message || 'No error message available')
      }
    }

    fetchNotificationCount()
  }, [])

  

  const LoggedOutMenu = () => (
    <HStack spacing={4}>
      <Button id="loginBtn" onClick={() => (window.location.href = loginPage)} colorScheme="green" size="sm" fontWeight="700" borderRadius="10px">
        Login
      </Button>
      <Button onClick={() => (window.location.href = signupPage)} colorScheme="yellow" size="sm" fontWeight="700" borderRadius="10px">
        Sign up
      </Button>
    </HStack>
  )

  return (
    <>
      <Box p={3} mb={'3em'} width={'100%'} position="sticky" alignSelf="center" alignContent={'center'} alignItems={'center'} top={'0'} zIndex={5} data-testid="navbar-component" style={navbarStyle}>
        <Box mt={"0em"} mr={'2em'} ml={'2em'}>
          <Flex justifyContent="space-between">
            <Flex align="center">
              <IconButton aria-label="Back" icon={<ArrowL />} onClick={() => window.history.back()} variant="minimal" size="md" mr={2} rounded="full" />
              <IconButton aria-label="Forward" icon={<ArrowR />} onClick={() => window.history.forward()} variant="minimal" size="md" rounded="full" />
            </Flex>
            <Spacer />
            <Flex align="center" justifyContent="flex-end">
              <Notifications initialNotifcationCount={notificationCount} />
              {isUserLoggedIn ? < ></> : <LoggedOutMenu />}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
