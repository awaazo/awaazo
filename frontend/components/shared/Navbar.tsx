import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { DefaultSession } from 'next-auth'
import { Box, Flex, Avatar, IconButton, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuGroup, useBreakpointValue, Spacer } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { ArrowL, ArrowR } from '../../public/icons'
import AuthHelper from '../../helpers/AuthHelper'
import Notifications from '../notification/Notifications'
import { UserMenuInfo } from '../../types/Interfaces'
import { GoogleSSORequest } from '../../types/Requests'
import NotificationHelper from '../../helpers/NotificationsHelper'
import { useRouter } from 'next/router'

export default function Navbar() {
  const loginPage = '/auth/Login'
  const indexPage = '/'
  const signupPage = '/auth/Signup'
  const { data: session, status } = useSession()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [searchValue, setSearchValue] = useState('')





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

  const handleLogOut = async () => {
    try {
      // Wait for the logout request to complete
      await AuthHelper.authLogoutRequest()
      console.log('Logout successful')
      if (session) {
        await signOut()
      }

      // Set Logged In Status to false
      setIsUserLoggedIn(false)
      setIsUserSet(false)

      // Redirect to the index page
      window.location.href = indexPage
    } catch (error) {
      // Handle any errors that occur during logout
      console.error('Logout failed', error)
    }
  }
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const maxScroll = 100; // Adjust this value based on when you want the blur effect to be fully applied
    if (scrollY === 0) {
      // User has scrolled to the top, reset navbar style to initial
      setNavbarStyle({
        backdropFilter: 'blur(0px)',
        boxShadow: 'none', // Set boxShadow to 'none' to ensure it's fully transparent
      });
    } else {
      // User is scrolling down, apply dynamic blur and shadow
      const blurIntensity = Math.min(scrollY / maxScroll, 1) * 20; // 15px is the maximum blur value, adjust as needed
      setNavbarStyle({
        backdropFilter: `blur(${blurIntensity}px)`,
        boxShadow: '10px 12px 40px -10px rgba(0, 0, 0, 0.4)',
      });
    }
  }

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Cleanup by removing the event listener when the component unmounts
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

  const UserProfileMenu = () => (
    <Menu>
      <MenuButton aria-label="loggedInMenu" as={Button} rounded={'full'} variant={'link'} cursor={'pointer'}>
        {typeof user === 'function' ? (
          <Avatar size={'sm'} src={''} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)" />
        ) : (
          <Avatar size={'sm'} src={user.avatarUrl} boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)" bg="rgba(255, 255, 255, 0.2)" backdropFilter="blur(10px)" />
        )}
      </MenuButton>
      <MenuList>
        <MenuGroup>
          <Link href="/profile/MyProfile" passHref>
            <MenuItem>My Account</MenuItem>
          </Link>
          <Link href="/CreatorHub" passHref>
            <MenuItem>CreatorHub</MenuItem>
          </Link>
          <Link href="/Wallet" passHref>
            <MenuItem>Wallet</MenuItem>
          </Link>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem onClick={handleLogOut} style={{ color: 'red', fontWeight: 'normal' }}>
            Logout
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )

  const LoggedOutMenu = () => (
    <Menu>
      <MenuButton menu-id="menuBtn" aria-label="Menu" data-cy={`navbar-hamburger`} as={Button} variant={'link'} cursor={'pointer'}>
        <HamburgerIcon />
      </MenuButton>
      <MenuList>
        <MenuItem id="loginBtn" onClick={() => (window.location.href = loginPage)}>
          Login
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => (window.location.href = signupPage)}>Sign up</MenuItem>
      </MenuList>
    </Menu>
  )

  return (
    <>
      <Box p={3} mb={'3em'} width={'100%'} position="sticky" alignSelf="center" alignContent={'center'} alignItems={'center'} top={'0'} zIndex={5} data-testid="navbar-component" style={navbarStyle}>
        <Box mt={"0em"} mr={'2em'} ml={'2em'}>
          <Flex justifyContent="space-between">
            <Flex align="center">
              <IconButton aria-label="Back" icon={<ArrowL />} onClick={() => window.history.back()} variant="ghost" size="md" mr={2} rounded="full" />
              <IconButton aria-label="Forward" icon={<ArrowR />} onClick={() => window.history.forward()} variant="ghost" size="md" rounded="full" />
            </Flex>
            <Spacer />
            <Flex align="center" justifyContent="flex-end">
              <Notifications initialNotifcationCount={notificationCount} />
              {isUserLoggedIn ? <UserProfileMenu /> : <LoggedOutMenu />}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
