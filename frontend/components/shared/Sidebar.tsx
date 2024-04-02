import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Box, Flex, Icon, Image, VStack, Text, Tooltip, IconButton, useBreakpointValue, HStack, Avatar } from '@chakra-ui/react'
import Link from 'next/link'
import { DefaultSession } from 'next-auth'
import { Home, Search, Add, Cards, AwaazoA, ArrowR, ArrowL, Logout, Settings } from '../../public/icons'
import { useRouter } from 'next/router'
import PlaylistHelper from '../../helpers/PlaylistHelper'
import { Playlist } from '../../types/Interfaces'
import ViewQueueModal from '../playlist/ViewQueueModal'
import CreatePlaylistModal from '../playlist/CreatePlaylistModal'
import { PiQueueFill } from 'react-icons/pi'
import AuthHelper from '../../helpers/AuthHelper'
import LoginPrompt from '../auth/AuthPrompt'
import { UserMenuInfo } from '../../types/Interfaces'
import { GoogleSSORequest } from '../../types/Requests'

const Sidebar = () => {
  const router = useRouter()
  const loginPage = '/auth/Login'
  const indexPage = '/'
  const signupPage = '/auth/Signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [reload, setReload] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false)
  const onQueueModalClose = () => setIsQueueModalOpen(false)
  const onQueueModalOpen = () => setIsQueueModalOpen(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const onCreateModalClose = () => setIsCreateModalOpen(false)
  const onCreateModalOpen = () => setIsCreateModalOpen(true)
  const toggleCollapsed = () => setCollapsed(!collapsed)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [isUserSet, setIsUserSet] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const userPlaylists = playlists.filter((playlist) => playlist.isHandledByUser)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [user, setUser] = useState<UserMenuInfo>(() => ({
    id: '',
    username: '',
    avatarUrl: '',
    isAdmin: false,
  }))

  const handleModalClick = (event) => {
    event.stopPropagation()
  }
  const handleReload = () => {
    setReload(!reload)
  }

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
  useEffect(() => {
    const handlePlaylistUpdate = (event) => {
      console.log('Event received', event.detail)
      const updatedPlaylist = event.detail
      setPlaylists((currentPlaylists) => {
        const newPlaylists = currentPlaylists.map((playlist) => {
          if (playlist.id === updatedPlaylist.id) {
            return { ...playlist, ...updatedPlaylist }
          }
          return playlist
        })
        console.log('Updated playlists', newPlaylists)
        return newPlaylists
      })
    }

    window.addEventListener('playlistUpdated', handlePlaylistUpdate)

    return () => {
      window.removeEventListener('playlistUpdated', handlePlaylistUpdate)
    }
  }, [])

  const handleAddPlaylistClick = () => {
    console.log('Clicked')
    AuthHelper.authMeRequest().then((response) => {
      if (response.status === 401) {
        console.log('User not logged in')
        onCreateModalClose()
        setShowLoginPrompt(true)
        return
      } else {
        onCreateModalOpen()
      }
    })
  }

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(0, 20).then((res) => {
      if (res.status === 200) {
        setPlaylists(res.playlists)
      }
    })
  }, [reload])

  const MobileNavigation = () => {
    return (
      <Box position="fixed" bottom="0" left="0" right="0" py={2} zIndex={1000} borderTop={'2px solid rgba(255, 255, 255, 0.03)'} bg="rgba(255, 255, 255, 0.04)" backdropFilter="blur(40px)">
        <HStack justify="space-around">
          <Link href="/" passHref>
            <IconButton icon={<Home />} variant="ghost" aria-label="Home" borderRadius="50%" fontSize="18px" />
          </Link>
          <Link href="/Explore/Search" passHref>
            <IconButton icon={<Search />} variant="ghost" aria-label="Search" borderRadius="50%" fontSize="18px" />
          </Link>
          <Link href="/Playlist/" passHref>
            <IconButton icon={<Cards />} variant="ghost" aria-label="Playlist" onClick={onCreateModalOpen} borderRadius="50%" fontSize="18px" />
          </Link>
        </HStack>
      </Box>
    )
  }

  if (isMobile) {
    return <MobileNavigation />
  } else {
    return (
      <Box
        bg="az.darkestGrey"
        w={collapsed ? '60px' : '240px'}
        h="calc(88vh - 5em)"
        py={8}
        px={collapsed ? 2 : 3}
        position="sticky"
        mt="5em"
        top="5em"
        zIndex={10}
        transition="all 0.5s ease-in-out"
        roundedTopRight="10px"
        roundedBottomRight="10px"
        outline={'2px solid rgba(255, 255, 255, 0.06)'}
      >
        <Flex position="absolute" left={collapsed ? '40px' : '220px'} top="50%" transform="translateY(-50%)" zIndex="1" transition="all 0.5s ease-in-out">
          <Box borderRadius="full" bg="az.darkestGrey">
            <IconButton
              aria-label={collapsed ? 'Open Sidebar' : 'Close Sidebar'}
              icon={collapsed ? <ArrowR /> : <ArrowL />}
              onClick={toggleCollapsed}
              variant="ghost"
              color="#FFFFFF"
              transform="translateX(15%)"
              _hover={{ textDecoration: 'none', color: 'az.red' }}
              _active={{ background: 'transparent' }}
            />
          </Box>
        </Flex>

        <Flex justify="center" align="center" mb={7}>
          {collapsed ? (
            <Flex align="center">
              <Icon as={AwaazoA} w="25px" h="25px" fill={user.avatarUrl} />
              <Box w={'12px'} h={'12px'} bg="az.red" borderRadius="50%" mt="12px" transform=" translateX(-20%)" />
            </Flex>
          ) : (
            <Flex align="center">
              <Icon as={AwaazoA} w="12px" h="12px" ml="0" mb={'6'} color={'az.red'} />
              {typeof user === 'function' ? <Avatar size={'sm'} src={''} /> : <Avatar size={'md'} src={user.avatarUrl} boxShadow="0px 0px 41.599998474121094px rgba(255, 255, 255, 0.25)" />}
            </Flex>
          )}
        </Flex>

        <VStack align="left" spacing={'1em'}>
          <Box p={1} rounded={'xl'} width={'100%'}>
            {/* Home */}
            <Link href="/" passHref>
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                color={router.pathname === '/' ? 'az.red' : 'grey.700'}
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: 'none', color: 'az.red' }}
              >
                <Icon as={Home} fontSize="18px" mr={3} />
                {!collapsed && (
                  <Box flex="1" fontWeight="medium">
                    Home
                  </Box>
                )}
              </Flex>
            </Link>

            {/* Explore */}
            <Link href="/Explore/Search" passHref>
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                borderRadius="md"
                color={router.pathname === '/Explore/Search' ? 'az.red' : 'white'}
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: 'none', color: 'az.red' }}
              >
                <Icon as={Search} fontSize="18px" mr={3} />
                {!collapsed && (
                  <Box flex="1" fontWeight="medium" data-cy={`explore-icon`}>
                    Explore
                  </Box>
                )}
              </Flex>
            </Link>
          </Box>

          {/* My Shelf */}
          <Box p={1} bg={'rgba(0, 0, 0, 0.1)'} rounded={'xl'} width={'100%'}>
            <Flex align="center" p="2" mb="1" borderRadius="md" color="grey.700" transition="color 0.4s ease-in-out" _hover={{ textDecoration: 'none', color: 'az.red' }} onClick={toggleCollapsed}>
              <Icon as={Cards} fontSize="18px" mr={3} data-cy={`playlist-icon`} />
              {!collapsed && (
                <Box flex="1" fontWeight="medium">
                  My Shelf
                </Box>
              )}
              {!collapsed && (
                <Box onClick={handleModalClick}>
                  {' '}
                  <Tooltip label="View Queue" fontSize="xs" placement="top" openDelay={1000}>
                    <span>
                      <IconButton icon={<PiQueueFill />} variant="minimal" color="az.greyish" aria-label="View Queue" fontSize={'15px'} onClick={onQueueModalOpen} data-cy={`queue-button`} />{' '}
                    </span>
                  </Tooltip>
                  {/* Conditionally rendering the create playlist button only when login prompt is not visible */}
                  {!showLoginPrompt && (
                    <Tooltip label="Create Playlist" fontSize="xs" placement="top" openDelay={1000}>
                      <span>
                        <IconButton
                          icon={<Add />}
                          variant="minimal"
                          color="az.greyish"
                          aria-label="Add Playlist"
                          fontSize={'sm'}
                          onClick={() => {
                            handleAddPlaylistClick()
                            onCreateModalOpen()
                          }}
                          data-cy={`add-playlist-button`}
                        />
                      </span>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Flex>

            {/* User Playlists */}
            {!showLoginPrompt && userPlaylists.length > 0 && (
              <VStack align="left" spacing={1} mt={4} maxH='calc(100vh - 10em - 20em' overflowY="auto">
                {userPlaylists.map((playlist) => (
                  <Link href={`/Playlist/${playlist.id}`} key={playlist.id} passHref>
                    <Flex align="center" padding={1} pl={2} borderRadius="5px" _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}>
                      <Image
                        src={`${playlist.coverArt}?v=${playlist.lastUpdated}`}
                        alt="Playlist"
                        boxSize={collapsed ? '16px' : '34px'}
                        objectFit="cover"
                        mr={collapsed ? '0' : '2'}
                        borderRadius="8"
                        key={playlist.lastUpdated}
                      />
                      {!collapsed && <Text data-cy={`playlist-${playlist.name}`} fontSize={'sm'} >{playlist.name}</Text> }
                    </Flex>
                  </Link>
                ))}
              </VStack>
            )}
          </Box>

          <Box p={1}   width={'100%'} position="absolute" bottom="5">
            {/* Settings */}
            <Link href="/CreatorHub" passHref>
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                color={router.pathname === '/CreatorHub' ? 'az.red' : 'grey.700'}
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: 'none', color: 'az.red' }}
              >
                <Icon as={Settings} fontSize="18px" mr={3} />
                {!collapsed && (
                  <Box flex="1" fontWeight="medium">
                    Settings
                  </Box>
                )}
              </Flex>
            </Link>

            {/* logout */}
            
              <Flex
                as={Flex}
                align="center"
                p="2"
                mb="1"
                borderRadius="md"
                color={router.pathname === '/Explore/Search' ? 'az.red' : 'white'}
                transition="color 0.4s ease-in-out"
                _hover={{ textDecoration: 'none', color: 'az.red' }}
                onClick={handleLogOut}
              >
                <Icon as={Logout} fontSize="18px" mr={3} />
                {!collapsed && (
                  <Box flex="1" fontWeight="medium" data-cy={`explore-icon`}>
                    Logout
                  </Box>
                )}
              </Flex>
            
          </Box>
        </VStack>
        <ViewQueueModal isOpen={isQueueModalOpen} onClose={onQueueModalClose} />
        <CreatePlaylistModal handleReload={handleReload} isOpen={isCreateModalOpen} onClose={onCreateModalClose} />
        {/* LoginPrompt */}
        {showLoginPrompt && (
          <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="To access this feature, you must be logged in. Please log in or create an account." />
        )}
      </Box>
    )
  }
}

export default Sidebar
