import React, { useEffect } from 'react'
import { Box, Flex, Icon, VStack, Image } from '@chakra-ui/react'
import Link from 'next/link'
import { MdSpaceDashboard } from 'react-icons/md'

import { Mail, Warning, AwaazoAdminPannel, User } from '../../public/icons'
import { useRouter } from 'next/router'
import AuthHelper from '../../helpers/AuthHelper'

const AdminSidebar = () => {
  useEffect(() => {
    checkAuth()
  }, [])

  const router = useRouter()

  return (
    <Box
      bg="linear-gradient(180deg, #2D2D2F8C, #1F1F218C)"
      w="80px"
      mt={'1em'}
      h="calc(100vh - 2em)"
      roundedTopRight="25px"
      roundedBottomRight="25px"
      px={4}
      py={8}
      position="sticky"
      zIndex={10}
      border={'2px solid rgba(255, 255, 255, 0.03)'}
    >
      <VStack align="center" spacing={4}>
        <Flex justify="center" align="center" mb={'40px'} mt={'40px'}>
          <Icon as={AwaazoAdminPannel} boxSize={'50px'} />
        </Flex>
        <Link href="/Admin/">
          <Flex align="center" p={2} color={router.pathname === '/Admin' ? 'az.red' : 'white'}>
            <Icon as={MdSpaceDashboard} boxSize={'30px'} />
          </Flex>
        </Link>

        <Link href="/Admin/Reports">
          <Flex align="center" p={2} color={router.pathname === '/Admin/Reports' ? 'az.red' : 'white'}>
            <Icon as={Warning} boxSize={'25px'} />
          </Flex>
        </Link>

        <Link href="/Admin/UserManagement">
          <Flex align="center" p={2} color={router.pathname === '/Admin/UserManagement' ? 'az.red' : 'white'}>
            <Icon as={User} boxSize={'25px'} />
          </Flex>
        </Link>

        <Link href="/Admin/EmailLogs">
          <Flex align="center" p={2} color={router.pathname === '/Admin/EmailLogs' ? 'az.red' : 'white'}>
            <Icon as={Mail} boxSize={'25px'} />
          </Flex>
        </Link>
      </VStack>
    </Box>
  )
}

const checkAuth = async () => {
  try {
    const res = await AuthHelper.authMeRequest()
    console.log('response:', res)
    if (!res) {
      window.location.href = '/login'
    } else if (res.userMenuInfo.isAdmin !== true) {
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Error occurred while fetching authentication data:', error)
  }
}

export default AdminSidebar
