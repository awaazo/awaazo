
//NAVBAR,tsx
import { useEffect, useState } from 'react'
import { Box, Flex, IconButton, useBreakpointValue, Spacer, Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ArrowL, ArrowR } from '../../public/icons'
import Notifications from '../notification/Notifications'
import NotificationHelper from '../../helpers/NotificationsHelper'
import LanguageSelector from '../assets/LanguageSelector';
import i18n from '../../utilities/i18n'

export default function Navbar() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [notificationCount, setNotificationCount] = useState(0)
  const [language, setLanguage] = useState(i18n.language)
  const [navbarStyle, setNavbarStyle] = useState({
    backdropFilter: 'blur(0px)',
    boxShadow: '',
  })

  const handleScroll = () => {
    const scrollY = window.scrollY
    const maxScroll = 100
    if (scrollY === 0) {
      setNavbarStyle({
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
      })
    } else {
      const blurIntensity = Math.min(scrollY / maxScroll, 1) * 20
      setNavbarStyle({
        backdropFilter: `blur(${blurIntensity}px)`,
        boxShadow: '10px 12px 40px -10px rgba(0, 0, 0, 0.4)',
      })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
  }

  return (
    <>
      <Box p={3} mb={'3em'} width={'100%'} position="sticky" alignSelf="center" alignContent={'center'} alignItems={'center'} top={'0'} zIndex={5} data-testid="navbar-component" style={navbarStyle}>
        <Box mt={'0em'} mr={'2em'} ml={'2em'}>
          <Flex justifyContent="space-between">
            <Flex align="center">
              <IconButton aria-label="Back" icon={<ArrowL />} onClick={() => window.history.back()} variant="minimal" size="md" mr={2} rounded="full" />
              <IconButton aria-label="Forward" icon={<ArrowR />} onClick={() => window.history.forward()} variant="minimal" size="md" rounded="full" />
            </Flex>
            <Spacer />
            <Flex align="center" justifyContent="flex-end">
              <Notifications initialNotifcationCount={notificationCount} />
              <LanguageSelector changeLanguage={changeLanguage} />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
